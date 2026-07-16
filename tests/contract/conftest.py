import os
import tempfile

import pytest


def pytest_configure(config):
    import gltest.direct.wasi_mock as wasi_mock
    import gltest.direct.loader as loader

    original_handle_gl_call = wasi_mock._handle_gl_call

    def _handle_gl_call_with_eth_send(vm, request):
        if isinstance(request, dict) and "EthSend" in request:
            data = request["EthSend"]
            address = data["address"]
            value = int(data.get("value", 0))
            addr_bytes = _address_bytes(address)
            vm._balances[addr_bytes] = vm._balances.get(addr_bytes, 0) + value
            return {"ok": None}
        return original_handle_gl_call(vm, request)

    wasi_mock._handle_gl_call = _handle_gl_call_with_eth_send

    if os.name != "nt":
        return

    def _inject_message_to_fd0_windows(vm):
        try:
            from genlayer.py import calldata
            from genlayer.py.types import Address
        except ImportError:
            return

        sender_addr = vm.sender
        if isinstance(sender_addr, bytes):
            sender_addr = Address(sender_addr)

        contract_addr = vm._contract_address
        if isinstance(contract_addr, bytes):
            contract_addr = Address(contract_addr)

        origin_addr = vm.origin
        if isinstance(origin_addr, bytes):
            origin_addr = Address(origin_addr)

        message_data = {
            "contract_address": contract_addr,
            "sender_address": sender_addr,
            "origin_address": origin_addr,
            "stack": [],
            "value": vm._value,
            "datetime": vm._datetime,
            "is_init": False,
            "chain_id": vm._chain_id,
            "entry_kind": 0,
            "entry_data": b"",
            "entry_stage_data": None,
        }

        encoded = calldata.encode(message_data)
        fd, path = tempfile.mkstemp()
        try:
            os.write(fd, encoded)
            os.lseek(fd, 0, os.SEEK_SET)
            vm._original_stdin_fd = os.dup(0)
            os.dup2(fd, 0)
            vm._direct_mode_stdin_temp_path = path
        finally:
            os.close(fd)

    loader._inject_message_to_fd0 = _inject_message_to_fd0_windows


def _address_bytes(address):
    if isinstance(address, bytes):
        return address
    if hasattr(address, "as_bytes"):
        return address.as_bytes
    if hasattr(address, "__bytes__"):
        return bytes(address)
    if isinstance(address, str):
        return bytes.fromhex(address[2:] if address.startswith("0x") else address)
    raise TypeError(f"cannot convert {type(address)} to bytes")


@pytest.fixture(autouse=True)
def cleanup_windows_direct_mode_stdin_file(direct_vm):
    yield

    path = getattr(direct_vm, "_direct_mode_stdin_temp_path", None)
    if not path:
        return

    try:
        os.unlink(path)
    except OSError:
        pass
    finally:
        direct_vm._direct_mode_stdin_temp_path = None
