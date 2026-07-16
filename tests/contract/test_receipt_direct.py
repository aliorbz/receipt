from datetime import datetime, timezone

import pytest


CONTRACT_PATH = "contracts/receipt.py"
GENVM_RUNTIME_VERSION = "v0.2.12"
REWARD = 3 * 10**18
NOW = "2026-01-01T00:00:00+00:00"
FUTURE_DEADLINE = 1_767_312_000
PAST_DEADLINE = 1_704_067_200


def _deploy(direct_deploy, direct_vm):
    direct_vm.warp(NOW)
    return direct_deploy(CONTRACT_PATH, sdk_version=GENVM_RUNTIME_VERSION)


def _payable_call(direct_vm, value, call):
    if not hasattr(direct_vm, "value"):
        pytest.skip(
            "genlayer-test direct mode does not expose a documented payable value "
            "cheatcode in the current docs; run this test after installing a version "
            "that supports payable direct calls, or port it to Studio mode."
        )
    previous_value = direct_vm.value
    direct_vm.value = value
    try:
        return call()
    finally:
        direct_vm.value = previous_value


def _create_task(contract, direct_vm, reward=REWARD, deadline=FUTURE_DEADLINE, metadata_ref="ipfs://task"):
    return _payable_call(
        direct_vm,
        reward,
        lambda: contract.create_task(reward, deadline, "design", metadata_ref),
    )


def _balance(direct_vm, address):
    return direct_vm._balances.get(_address_bytes(address), 0)


def _address(address):
    from genlayer.py.types import Address

    if isinstance(address, Address):
        return address
    return Address(address)


def _address_bytes(address):
    if isinstance(address, bytes):
        return address
    if hasattr(address, "as_bytes"):
        return address.as_bytes
    if hasattr(address, "__bytes__"):
        return bytes(address)
    raise TypeError(f"cannot convert {type(address)} to bytes")


def test_valid_task_creation(direct_vm, direct_deploy):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    task = contract.get_task(task_id)
    assert task.task_id == task_id
    assert task.reward_amount == REWARD
    assert task.status == 0
    assert contract.get_total_task_count() == 1
    assert contract.get_locked_rewards() == REWARD


def test_reject_task_creation_with_zero_reward(direct_vm, direct_deploy):
    contract = _deploy(direct_deploy, direct_vm)

    with direct_vm.expect_revert("reward must be greater than zero"):
        _create_task(contract, direct_vm, reward=0)


def test_reject_mismatched_declared_and_attached_reward(direct_vm, direct_deploy):
    contract = _deploy(direct_deploy, direct_vm)

    with direct_vm.expect_revert("attached GEN must equal declared reward"):
        _payable_call(
            direct_vm,
            REWARD - 1,
            lambda: contract.create_task(REWARD, FUTURE_DEADLINE, "design", "ipfs://task"),
        )


def test_reject_past_deadline(direct_vm, direct_deploy):
    contract = _deploy(direct_deploy, direct_vm)

    with direct_vm.expect_revert("deadline must be in the future"):
        _create_task(contract, direct_vm, deadline=PAST_DEADLINE)


def test_accept_open_task(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)

    task = contract.get_task(task_id)
    assert task.contributor == _address(direct_bob)
    assert task.status == 1


def test_prevent_client_from_accepting_own_task(direct_vm, direct_deploy):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.expect_revert("client cannot accept own task"):
        contract.accept_task(task_id)


def test_prevent_second_contributor_from_accepting(direct_vm, direct_deploy, direct_bob, direct_charlie):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)

    with direct_vm.prank(direct_charlie):
        with direct_vm.expect_revert("task is not open"):
            contract.accept_task(task_id)


def test_prevent_acceptance_after_deadline(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    direct_vm.warp(datetime.fromtimestamp(FUTURE_DEADLINE + 1, timezone.utc).isoformat())
    with direct_vm.prank(direct_bob):
        with direct_vm.expect_revert("deadline has passed"):
            contract.accept_task(task_id)


def test_assigned_contributor_submits_work(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    task = contract.get_task(task_id)
    assert task.status == 2
    assert task.submission_ref == "ipfs://submission"


def test_other_wallet_cannot_submit(direct_vm, direct_deploy, direct_bob, direct_charlie):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)

    with direct_vm.prank(direct_charlie):
        with direct_vm.expect_revert("only assigned contributor can submit"):
            contract.submit_task(task_id, "ipfs://submission")


def test_contributor_cancellation_returns_reward_to_client(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    client_before = _balance(direct_vm, direct_alice)
    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.cancel_accepted_task(task_id)

    task = contract.get_task(task_id)
    assert task.status == 7
    assert task.cancelled_by_contributor is True
    assert contract.get_locked_rewards() == 0
    assert _balance(direct_vm, direct_alice) == client_before + REWARD


def test_other_wallet_cannot_cancel(direct_vm, direct_deploy, direct_bob, direct_charlie):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)

    with direct_vm.prank(direct_charlie):
        with direct_vm.expect_revert("only assigned contributor can cancel"):
            contract.cancel_accepted_task(task_id)


def test_client_completes_submitted_task(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)
    task = contract.get_task(task_id)
    assert task.status == 6
    assert task.payout_released is True
    assert contract.get_locked_rewards() == 0


def test_other_wallet_cannot_complete(direct_vm, direct_deploy, direct_bob, direct_charlie):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    with direct_vm.prank(direct_charlie):
        with direct_vm.expect_revert("only client can complete task"):
            contract.complete_task(task_id)


def test_contributor_receives_full_reward(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    contributor_before = _balance(direct_vm, direct_bob)
    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)
    assert _balance(direct_vm, direct_bob) == contributor_before + REWARD


def test_task_cannot_complete_twice(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)
    with direct_vm.expect_revert("task must be submitted before completion"):
        contract.complete_task(task_id)


def test_task_cannot_submit_after_cancellation(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.cancel_accepted_task(task_id)
        with direct_vm.expect_revert("task must be accepted before submission"):
            contract.submit_task(task_id, "ipfs://submission")


def test_task_cannot_change_after_completion(direct_vm, direct_deploy, direct_bob):
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)
    with direct_vm.prank(direct_bob):
        with direct_vm.expect_revert("task must be accepted before submission"):
            contract.submit_task(task_id, "ipfs://another-submission")


def test_profile_counters_update_correctly(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)

    client_profile = contract.get_profile(_address(direct_alice))
    contributor_profile = contract.get_profile(_address(direct_bob))
    assert client_profile.exists is True
    assert client_profile.published_task_count == 1
    assert contributor_profile.exists is True
    assert contributor_profile.accepted_task_count == 1
    assert contributor_profile.completed_task_count == 1


def test_read_methods_return_expected_task_ids_and_states(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm)
    task_id = _create_task(contract, direct_vm)

    with direct_vm.prank(direct_bob):
        contract.accept_task(task_id)
        contract.submit_task(task_id, "ipfs://submission")

    contract.complete_task(task_id)

    assert list(contract.get_published_task_ids(_address(direct_alice), 0, 10)) == [task_id]
    assert list(contract.get_accepted_task_ids(_address(direct_bob), 0, 10)) == [task_id]
    assert list(contract.get_completed_task_ids(_address(direct_bob), 0, 10)) == [task_id]
    assert contract.get_task(task_id).status == 6
