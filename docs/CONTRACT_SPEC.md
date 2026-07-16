# Receipt Contract Specification

Phase 3A defines the deterministic foundation for Receipt's native GenLayer Intelligent Contract. It does not connect the frontend, deploy to Bradbury, add AI evaluation, or implement reputation score changes.

## Network Target

- Network: GenLayer Bradbury Testnet
- Chain ID: `4221`
- Native token: `GEN`
- GenLayer RPC: `https://rpc-bradbury.genlayer.com`
- Chain RPC: `https://rpc.testnet-chain.genlayer.com`

## Official Tooling Assumptions

Receipt uses a native GenLayer Intelligent Contract written in Python.

The contract uses:

- typed class-level persistent storage
- public view and write methods
- payable write methods for native GEN custody
- native GEN transfers through official GenLayer value-transfer semantics
- deterministic transaction timestamps from the GenVM context

The current deterministic milestone intentionally avoids nondeterministic blocks, LLM calls, and AI adjudication.

## Identity

One wallet represents one Receipt profile.

The same wallet may act as both client and contributor across different tasks. A wallet cannot accept its own task.

Wallet address comparisons are exact at the contract level. Frontend case normalization is a UI concern; contract calls must pass canonical addresses accepted by the GenLayer `Address` type.

For v0, contract profiles contain only enforcement-relevant values:

- `exists`
- `client_score`
- `contributor_score`
- `published_task_count`
- `accepted_task_count`
- `completed_task_count`

Username, avatar, and bio remain frontend/off-chain data.

## Statuses

Statuses are represented as integer constants:

- `OPEN = 0`
- `ACCEPTED = 1`
- `SUBMITTED = 2`
- `EVALUATING = 3`
- `CLIENT_REVIEW = 4`
- `REVISION_REQUESTED = 5`
- `COMPLETED = 6`
- `CANCELLED = 7`

Phase 3A implements only:

- create: none to `OPEN`
- accept: `OPEN` to `ACCEPTED`
- contributor cancel: `ACCEPTED` to `CANCELLED`
- submit: `ACCEPTED` to `SUBMITTED`
- client complete: `SUBMITTED` to `COMPLETED`

`EVALUATING`, `CLIENT_REVIEW`, and `REVISION_REQUESTED` are reserved for later GenLayer evaluation and review work.

## Task Object

The persistent task shape is intentionally minimal:

- `task_id`
- `client`
- `contributor`
- `reward_amount`
- `deadline`
- `status`
- `category`
- `metadata_ref`
- `submission_ref`
- `created_timestamp`
- `accepted_timestamp`
- `submitted_timestamp`
- `completed_timestamp`
- `cancelled_timestamp`
- `cancelled_by_contributor`
- `payout_released`

`metadata_ref` points to off-chain task content such as title, full description, and requirements. `submission_ref` points to off-chain evidence such as work URL, notes, screenshots, or file references.

References should be URI strings such as `ipfs://...`, `ar://...`, or `https://...`, optionally using a content-addressed URI or a URI plus hash convention in the off-chain metadata. Large documents, images, and private files must not be stored directly in contract storage.

## Receipt Identity

The task ID is also the Receipt ID.

A Receipt exists from the moment the task is created, and its status evolves through the task lifecycle. There is no separate receipt object in v0 because the task already contains the immutable identity, custody amount, parties, references, timestamps, and final state needed by the frontend. A separate receipt object should be introduced only if later phases require immutable final-state data that should diverge from mutable task workflow state.

## Task Creation

Method: `create_task(reward_amount, deadline, category, metadata_ref)`

This is a payable write method.

Rules:

- `reward_amount` must be greater than zero.
- Attached GEN must equal `reward_amount`.
- `deadline` must be in the future.
- `metadata_ref` cannot be empty.
- The task receives a new sequential ID.
- The task begins as `OPEN`.
- The reward remains locked in the contract.
- The task is indexed under the client's published task IDs.
- The client profile is initialized if needed.

## Task Acceptance

Method: `accept_task(task_id)`

Rules:

- Task must be `OPEN`.
- Contributor cannot equal client.
- Contributor address must not already be assigned.
- Deadline must not have passed.
- The contributor profile is initialized if needed.
- Contributor is assigned.
- Status becomes `ACCEPTED`.
- The task is indexed under the contributor's accepted task IDs.

## Contributor Cancellation

Method: `cancel_accepted_task(task_id)`

Rules:

- Only the assigned contributor may cancel.
- Only an `ACCEPTED` task may be cancelled this way.
- Full reward returns to the client.
- Reputation penalties are not implemented yet.
- `cancelled_by_contributor` is recorded for the later reputation system.
- Status becomes `CANCELLED`.

The client cannot cancel an accepted task in this milestone. That avoids unpaid-work edge cases before dispute logic exists.

## Submission

Method: `submit_task(task_id, submission_ref)`

Rules:

- Only the assigned contributor may submit.
- Task must be `ACCEPTED`.
- `submission_ref` cannot be empty.
- Submission reference is stored.
- Status becomes `SUBMITTED`.

## Completion

Method: `complete_task(task_id)`

Rules:

- Only the client may complete.
- Task must be `SUBMITTED`.
- Full locked reward transfers to the contributor.
- Status becomes `COMPLETED`.
- Completed timestamp is stored.
- `payout_released` prevents double payout and repeated completion.

This temporary client-controlled completion method will later be extended with GenLayer evaluation and client review.

## Read Methods

Implemented reads:

- `get_task(task_id)`
- `get_total_task_count()`
- `get_profile(wallet)`
- `get_published_task_ids(wallet, offset, limit)`
- `get_accepted_task_ids(wallet, offset, limit)`
- `get_completed_task_ids(wallet, offset, limit)`
- `get_locked_rewards()`

Task ID lists are paginated with `offset` and `limit` to avoid unbounded reads.

## Security And Invariants

The contract must enforce:

- no self-acceptance
- no accepting twice
- no submission from another wallet
- no completion by another wallet
- no reward changes after creation
- no metadata changes after acceptance
- no completion before submission
- no double payout
- no submission after cancellation
- no mutable workflow changes after completion
- locked reward accounting equals active locked rewards
- failed writes do not leave partial state changes
- external GEN transfers follow official GenLayer finality behavior

## Persistent Storage Model

The contract stores:

- `next_task_id: u256`
- `locked_rewards: u256`
- `tasks: TreeMap[u256, Task]`
- `profiles: TreeMap[Address, Profile]`
- `published_task_ids: TreeMap[Address, DynArray[u256]]`
- `accepted_task_ids: TreeMap[Address, DynArray[u256]]`
- `completed_task_ids: TreeMap[Address, DynArray[u256]]`

`Task` and `Profile` are `@allow_storage` dataclasses. Arrays use `DynArray`, and mappings use `TreeMap`.

## Value Transfer Behavior

Task creation receives native GEN through `@gl.public.write.payable` and checks `gl.message.value`.

Contributor cancellation releases the full reward back to the client.

Client completion releases the full reward to the contributor.

Transfers to wallets use GenLayer's EVM contract interface external-transfer pattern. The contract marks state before emitting the transfer message so repeated calls cannot trigger duplicate payouts.

## Future Frontend Service Boundary

The frontend should eventually use a contract service API similar to:

```ts
createTask(params, rewardWei)
acceptTask(taskId)
cancelAcceptedTask(taskId)
submitTask(taskId, submissionRef)
completeTask(taskId)
getTask(taskId)
getTasks(query)
getProfile(address)
```

Transaction methods:

- `createTask`: write, attaches GEN
- `acceptTask`: write
- `cancelAcceptedTask`: write, emits GEN refund on finalization
- `submitTask`: write
- `completeTask`: write, emits GEN payout on finalization

Read methods:

- `getTask`
- `getTasks`
- `getProfile`

Expected transaction behavior:

- The frontend should submit writes through the GenLayer client.
- It should wait for the transaction status required by the current GenLayer SDK before treating state as final.
- GEN transfers emitted by cancellation and completion should be treated as final only after the parent transaction reaches the official finalization state.

TypeScript status mapping:

```ts
const TASK_STATUS = {
  0: "OPEN",
  1: "ACCEPTED",
  2: "SUBMITTED",
  3: "EVALUATING",
  4: "CLIENT_REVIEW",
  5: "REVISION_REQUESTED",
  6: "COMPLETED",
  7: "CANCELLED",
} as const;
```

## Out Of Scope For Phase 3A

- frontend contract integration
- Bradbury deployment
- AI or LLM evaluation
- nondeterministic blocks
- client revision requests
- disputes
- partial payouts
- client cancellation after acceptance
- score calculations
- category scores
- subscriptions
- verification
