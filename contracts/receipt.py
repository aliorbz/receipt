# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from dataclasses import dataclass
from datetime import datetime, timezone

from genlayer import *


STATUS_OPEN = u8(0)
STATUS_ACCEPTED = u8(1)
STATUS_SUBMITTED = u8(2)
STATUS_EVALUATING = u8(3)
STATUS_CLIENT_REVIEW = u8(4)
STATUS_REVISION_REQUESTED = u8(5)
STATUS_COMPLETED = u8(6)
STATUS_CANCELLED = u8(7)

ZERO_ADDRESS = Address("0x0000000000000000000000000000000000000000")


@gl.evm.contract_interface
class _ExternalAccount:
    class View:
        pass

    class Write:
        pass


@allow_storage
@dataclass
class Profile:
    exists: bool
    client_score: u256
    contributor_score: u256
    published_task_count: u256
    accepted_task_count: u256
    completed_task_count: u256


@allow_storage
@dataclass
class Task:
    task_id: u256
    client: Address
    contributor: Address
    reward_amount: u256
    deadline: u256
    status: u8
    category: str
    metadata_ref: str
    submission_ref: str
    created_timestamp: u256
    accepted_timestamp: u256
    submitted_timestamp: u256
    completed_timestamp: u256
    cancelled_timestamp: u256
    cancelled_by_contributor: bool
    payout_released: bool


class Receipt(gl.Contract):
    next_task_id: u256
    locked_rewards: u256
    tasks: TreeMap[u256, Task]
    profiles: TreeMap[Address, Profile]
    published_task_ids: TreeMap[Address, DynArray[u256]]
    accepted_task_ids: TreeMap[Address, DynArray[u256]]
    completed_task_ids: TreeMap[Address, DynArray[u256]]

    def __init__(self) -> None:
        self.next_task_id = u256(1)
        self.locked_rewards = u256(0)

    @gl.public.write.payable
    def create_task(
        self,
        reward_amount: u256,
        deadline: u256,
        category: str,
        metadata_ref: str,
    ) -> u256:
        now = self._now()
        client = gl.message.sender_address

        if reward_amount == u256(0):
            raise gl.vm.UserError("reward must be greater than zero")
        if gl.message.value != reward_amount:
            raise gl.vm.UserError("attached GEN must equal declared reward")
        if deadline <= now:
            raise gl.vm.UserError("deadline must be in the future")
        if metadata_ref == "":
            raise gl.vm.UserError("metadata reference is required")

        self._ensure_profile(client)

        task_id = self.next_task_id
        self.next_task_id = self.next_task_id + u256(1)

        self.tasks[task_id] = Task(
            task_id=task_id,
            client=client,
            contributor=ZERO_ADDRESS,
            reward_amount=reward_amount,
            deadline=deadline,
            status=STATUS_OPEN,
            category=category,
            metadata_ref=metadata_ref,
            submission_ref="",
            created_timestamp=now,
            accepted_timestamp=u256(0),
            submitted_timestamp=u256(0),
            completed_timestamp=u256(0),
            cancelled_timestamp=u256(0),
            cancelled_by_contributor=False,
            payout_released=False,
        )

        profile = self.profiles[client]
        profile.published_task_count = profile.published_task_count + u256(1)
        self.profiles[client] = profile
        self._append_id(self.published_task_ids, client, task_id)
        self.locked_rewards = self.locked_rewards + reward_amount

        return task_id

    @gl.public.write
    def accept_task(self, task_id: u256) -> None:
        now = self._now()
        contributor = gl.message.sender_address
        task = self._require_task(task_id)

        if task.status != STATUS_OPEN:
            raise gl.vm.UserError("task is not open")
        if contributor == task.client:
            raise gl.vm.UserError("client cannot accept own task")
        if task.contributor != ZERO_ADDRESS:
            raise gl.vm.UserError("task already has a contributor")
        if task.deadline <= now:
            raise gl.vm.UserError("deadline has passed")

        self._ensure_profile(contributor)

        task.contributor = contributor
        task.status = STATUS_ACCEPTED
        task.accepted_timestamp = now
        self.tasks[task_id] = task

        profile = self.profiles[contributor]
        profile.accepted_task_count = profile.accepted_task_count + u256(1)
        self.profiles[contributor] = profile
        self._append_id(self.accepted_task_ids, contributor, task_id)

    @gl.public.write
    def cancel_accepted_task(self, task_id: u256) -> None:
        now = self._now()
        sender = gl.message.sender_address
        task = self._require_task(task_id)

        if task.status != STATUS_ACCEPTED:
            raise gl.vm.UserError("only accepted tasks can be cancelled by contributor")
        if sender != task.contributor:
            raise gl.vm.UserError("only assigned contributor can cancel")

        task.status = STATUS_CANCELLED
        task.cancelled_timestamp = now
        task.cancelled_by_contributor = True
        self.tasks[task_id] = task
        self._release_reward_to(task.client, task.reward_amount)

    @gl.public.write
    def submit_task(self, task_id: u256, submission_ref: str) -> None:
        now = self._now()
        sender = gl.message.sender_address
        task = self._require_task(task_id)

        if task.status != STATUS_ACCEPTED:
            raise gl.vm.UserError("task must be accepted before submission")
        if sender != task.contributor:
            raise gl.vm.UserError("only assigned contributor can submit")
        if submission_ref == "":
            raise gl.vm.UserError("submission reference is required")

        task.submission_ref = submission_ref
        task.status = STATUS_SUBMITTED
        task.submitted_timestamp = now
        self.tasks[task_id] = task

    @gl.public.write
    def complete_task(self, task_id: u256) -> None:
        now = self._now()
        sender = gl.message.sender_address
        task = self._require_task(task_id)

        if task.status != STATUS_SUBMITTED:
            raise gl.vm.UserError("task must be submitted before completion")
        if sender != task.client:
            raise gl.vm.UserError("only client can complete task")
        if task.payout_released:
            raise gl.vm.UserError("reward already released")

        task.status = STATUS_COMPLETED
        task.completed_timestamp = now
        task.payout_released = True
        self.tasks[task_id] = task

        contributor_profile = self.profiles[task.contributor]
        contributor_profile.completed_task_count = contributor_profile.completed_task_count + u256(1)
        self.profiles[task.contributor] = contributor_profile
        self._append_id(self.completed_task_ids, task.contributor, task_id)
        self._append_id(self.completed_task_ids, task.client, task_id)
        self._release_reward_to(task.contributor, task.reward_amount)

    @gl.public.view
    def get_task(self, task_id: u256) -> Task:
        return self._require_task(task_id)

    @gl.public.view
    def get_total_task_count(self) -> u256:
        return self.next_task_id - u256(1)

    @gl.public.view
    def get_profile(self, wallet: Address) -> Profile:
        return self.profiles.get(wallet, self._empty_profile())

    @gl.public.view
    def get_published_task_ids(
        self,
        wallet: Address,
        offset: u256,
        limit: u256,
    ) -> list[u256]:
        ids = self.published_task_ids.get(wallet, [])
        return self._slice_ids(ids, offset, limit)

    @gl.public.view
    def get_accepted_task_ids(
        self,
        wallet: Address,
        offset: u256,
        limit: u256,
    ) -> list[u256]:
        ids = self.accepted_task_ids.get(wallet, [])
        return self._slice_ids(ids, offset, limit)

    @gl.public.view
    def get_completed_task_ids(
        self,
        wallet: Address,
        offset: u256,
        limit: u256,
    ) -> list[u256]:
        ids = self.completed_task_ids.get(wallet, [])
        return self._slice_ids(ids, offset, limit)

    @gl.public.view
    def get_locked_rewards(self) -> u256:
        return self.locked_rewards

    def _now(self) -> u256:
        return u256(int(datetime.now(timezone.utc).timestamp()))

    def _require_task(self, task_id: u256) -> Task:
        task = self.tasks.get(task_id, self._empty_task())
        if task.task_id == u256(0):
            raise gl.vm.UserError("task does not exist")
        return task

    def _ensure_profile(self, wallet: Address) -> None:
        profile = self.profiles.get(wallet, self._empty_profile())
        if profile.exists:
            return
        profile.exists = True
        self.profiles[wallet] = profile

    def _append_id(
        self,
        index: TreeMap[Address, DynArray[u256]],
        wallet: Address,
        task_id: u256,
    ) -> None:
        if wallet not in index:
            index[wallet] = []
        ids = index[wallet]
        ids.append(task_id)

    def _slice_ids(
        self,
        ids: DynArray[u256] | list[u256],
        offset: u256,
        limit: u256,
    ) -> list[u256]:
        result: list[u256] = []
        start = int(offset)
        end = start + int(limit)
        total = len(ids)
        if start >= total:
            return result
        if end > total:
            end = total
        for index in range(start, end):
            result.append(ids[index])
        return result

    def _release_reward_to(self, recipient: Address, amount: u256) -> None:
        if amount == u256(0):
            raise gl.vm.UserError("reward amount is zero")
        if amount > self.locked_rewards:
            raise gl.vm.UserError("locked reward accounting underflow")
        self.locked_rewards = self.locked_rewards - amount
        _ExternalAccount(recipient).emit_transfer(value=amount)

    def _empty_profile(self) -> Profile:
        return Profile(
            exists=False,
            client_score=u256(0),
            contributor_score=u256(0),
            published_task_count=u256(0),
            accepted_task_count=u256(0),
            completed_task_count=u256(0),
        )

    def _empty_task(self) -> Task:
        return Task(
            task_id=u256(0),
            client=ZERO_ADDRESS,
            contributor=ZERO_ADDRESS,
            reward_amount=u256(0),
            deadline=u256(0),
            status=STATUS_CANCELLED,
            category="",
            metadata_ref="",
            submission_ref="",
            created_timestamp=u256(0),
            accepted_timestamp=u256(0),
            submitted_timestamp=u256(0),
            completed_timestamp=u256(0),
            cancelled_timestamp=u256(0),
            cancelled_by_contributor=False,
            payout_released=False,
        )
