# Receipt Development Notes

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4 via `@tailwindcss/vite`
- Lucide React icons
- Native injected EIP-1193 wallet integration
- Native GenLayer Intelligent Contract in Python for Phase 3A

The project remains frontend-first for the running UI. Phase 3A adds the contract development workspace and deterministic contract foundation only. The frontend is not connected to the contract yet.

## Installed Wallet Packages

None.

Phase 2A uses the browser's injected EIP-1193 provider directly through a small typed service. No Wagmi, RainbowKit, Web3Modal, ethers, Viem, or GenLayer SDK package was added because the wallet milestone only required wallet connect, account reads, chain reads, and chain switch/add-chain requests.

## Contract Development Dependencies

Python contract dependencies are listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

Required tools from current GenLayer documentation:

- Python 3.12+
- `genlayer-test`
- `genvm-linter`
- `pytest`
- Optional local Studio tooling: `npm install -g genlayer`
- Docker 26+ only if running local GenLayer Studio

The Direct Mode tests pin `sdk_version="v0.2.12"` because `genlayer-test 0.29.2` otherwise asks GitHub for the latest GenVM release. As of this setup, latest is `v0.3.0-rc7`, which does not publish `genvm-universal.tar.xz`; `v0.2.12` does.

`tests/contract/conftest.py` contains two Direct Mode harness fixes:

- On Windows, it avoids immediately unlinking the temporary stdin file while the process still has it open.
- It handles Direct Mode `EthSend` calls by crediting the in-memory VM balance map so native GEN transfer assertions can run locally.

Useful commands once Python tooling is installed:

```bash
genvm-lint check contracts/receipt.py
pytest tests/contract -v
npm run lint
npm run build
```

Local verification in this workspace could not run the Python contract tooling because only the Windows Store `python.exe` shim is present and `pip`, `pytest`, `genvm-lint`, and `genlayer` are not available on PATH.

## Network Configuration

Frontend wallet configuration lives in `src/config/genlayer.ts`.

- Network name: GenLayer Bradbury Testnet
- GenLayer network identifier: `testnetBradbury`
- Chain ID: `4221`
- Hex chain ID: `0x107d`
- Native currency symbol: `GEN`
- GenLayer RPC: `https://rpc-bradbury.genlayer.com`
- Chain/EVM RPC: `https://rpc.testnet-chain.genlayer.com`
- Chain explorer: `https://explorer.testnet-chain.genlayer.com`

No private keys, seed phrases, API keys, or secrets are used by the frontend. Deployment keys must never be committed.

## Folder Structure

```text
contracts/
  receipt.py
docs/
  CONTRACT_SPEC.md
scripts/
  deploy/
    README.md
src/
  components/
    feedback/
    layout/
    modals/
    profile/
    tasks/
  config/
    genlayer.ts
  data/
    mockData.ts
  hooks/
    useWallet.ts
  screens/
    LandingScreen.tsx
    ProfileScreen.tsx
    TaskBoardScreen.tsx
    TaskDetailScreen.tsx
  services/
    walletService.ts
  types/
    index.ts
  utils/
    taskHelpers.ts
  App.tsx
  index.css
  main.tsx
tests/
  contract/
    test_receipt_direct.py
```

## Contract Workspace

- `contracts/receipt.py`: Phase 3A deterministic native GenLayer Intelligent Contract.
- `tests/contract/test_receipt_direct.py`: direct-mode pytest coverage for the lifecycle rules.
- `docs/CONTRACT_SPEC.md`: source of truth for contract architecture, identity, statuses, storage, invariants, and future frontend service boundary.
- `scripts/deploy/README.md`: placeholder documenting that deployment is out of scope for Phase 3A.
- `requirements.txt`: Python tooling dependencies.

The contract intentionally does not use Solidity and does not introduce a separate EVM escrow contract.

## Contract Methods

Write methods:

- `create_task(reward_amount, deadline, category, metadata_ref)`: payable; creates an open task and locks native GEN.
- `accept_task(task_id)`: assigns a contributor to an open task.
- `cancel_accepted_task(task_id)`: assigned contributor cancels and returns the reward to the client.
- `submit_task(task_id, submission_ref)`: assigned contributor submits off-chain evidence.
- `complete_task(task_id)`: client completes the submitted task and releases the reward to the contributor.

Read methods:

- `get_task(task_id)`
- `get_total_task_count()`
- `get_profile(wallet)`
- `get_published_task_ids(wallet, offset, limit)`
- `get_accepted_task_ids(wallet, offset, limit)`
- `get_completed_task_ids(wallet, offset, limit)`
- `get_locked_rewards()`

## Persistent Contract Storage

- `next_task_id: u256`
- `locked_rewards: u256`
- `tasks: TreeMap[u256, Task]`
- `profiles: TreeMap[Address, Profile]`
- `published_task_ids: TreeMap[Address, DynArray[u256]]`
- `accepted_task_ids: TreeMap[Address, DynArray[u256]]`
- `completed_task_ids: TreeMap[Address, DynArray[u256]]`

Task metadata and submission evidence remain off-chain references.

## Wallet Architecture

- `src/config/genlayer.ts`: Public Bradbury network constants and the local app-session disconnect key.
- `src/services/walletService.ts`: Typed EIP-1193 provider access, account parsing, chain parsing, address formatting, case-insensitive address comparison, session disconnect flag helpers, `wallet_switchEthereumChain`, and `wallet_addEthereumChain`.
- `src/hooks/useWallet.ts`: React wallet state and lifecycle management.
- `src/App.tsx`: Coordinates wallet state with the existing mocked app identity and task workflows.

The wallet hook exposes:

- `providerAvailable`
- `address`
- `shortAddress`
- `chainId`
- `isConnected`
- `isConnecting`
- `isCorrectNetwork`
- `error`
- `connect`
- `disconnectSession`
- `switchToBradbury`

## Existing Pages

Routing is still local React state; React Router has not been added.

- `landing`
- `board`
- `detail`
- `profile`

## Existing Mock Data

Mock task/profile data lives in `src/data/mockData.ts`.

It includes:

- `CURRENT_USER_ADDRESS`: internal demo marker used to preserve the existing mock history
- `INITIAL_USER_PROFILE`
- `INITIAL_TASKS_LIST`

When a real wallet connects, the app maps demo-owned mock task references from the demo marker to the connected wallet address so the current demo history and self-acceptance behavior continue to work with wallet identity.

## Current Behavior

- Connect Wallet uses an injected browser wallet such as MetaMask or another EIP-1193-compatible wallet.
- The connected address is shown in the navbar.
- The full connected address is shown in the profile page.
- The profile remains temporary/mock data for now.
- The app detects whether the wallet is on Bradbury.
- Wrong-network state keeps the wallet connected and shows a Switch Network action.
- Switching uses `wallet_switchEthereumChain`.
- If Bradbury is missing, the app requests `wallet_addEthereumChain`, then retries switching.
- Account and chain changes update the UI.
- If the wallet returns no accounts, the app disconnects locally for the session.
- Disconnect clears Receipt's local connected state only; it does not claim to revoke wallet permissions.
- Already-authorized wallets restore connected UI on refresh unless the app-level disconnect flag is set.

## Current Problems And Limitations

- The frontend is not integrated with `contracts/receipt.py` yet.
- The contract is not deployed to Bradbury.
- GenLayer AI evaluation is not implemented.
- Reputation score changes are not implemented.
- No onchain username, avatar, or bio exists.
- There is no ESLint configuration yet; `npm run lint` currently runs `tsc --noEmit`.
- There are no automated UI tests yet.
- Browser wallet flows require manual testing in a browser with an injected wallet.
- Contract tests require local Python 3.12+ and GenLayer testing tools.

## Manual Wallet Test Checklist

1. No wallet installed: click Connect Wallet and confirm the app shows "No compatible browser wallet was detected."
2. Connection approved: approve the wallet request and confirm the board opens with the shortened address in the navbar.
3. Connection rejected: reject the wallet popup and confirm a friendly cancellation message appears.
4. Already-authorized refresh: refresh after connecting and confirm the connected UI restores without a new popup.
5. Wrong network: connect on a different chain and confirm the address remains visible plus Switch Network appears.
6. Successful switch to Bradbury: click Switch Network and approve the request.
7. Rejected network switch: reject the switch request and confirm the app remains connected with a friendly message.
8. Missing Bradbury chain: use a wallet without Bradbury configured and confirm the add-chain request appears.
9. Account changed: switch accounts in the wallet and confirm the navbar/profile address updates.
10. Wallet locked/no accounts: lock the wallet or remove all accounts and confirm Receipt locally disconnects.
11. Application-level disconnect: click Disconnect Wallet and confirm the UI returns to disconnected state without claiming permissions were revoked.
12. Reconnect: click Connect Wallet again and confirm the app reconnects normally.

## Contract Test Checklist

`tests/contract/test_receipt_direct.py` covers:

- valid task creation with attached GEN
- zero reward rejection
- mismatched declared and attached reward rejection
- past deadline rejection
- open task acceptance
- self-acceptance prevention
- second contributor prevention
- deadline-expired acceptance prevention
- assigned contributor submission
- unauthorized submission prevention
- contributor cancellation and refund behavior
- unauthorized cancellation prevention
- client completion
- unauthorized completion prevention
- contributor payout behavior
- double completion prevention
- submission after cancellation prevention
- mutation after completion prevention
- profile counter updates
- read method task ID/state results

The current official direct-mode docs do not document a payable value cheatcode, so the test helper skips payable-dependent tests when the installed `direct_vm` does not expose one. If that remains true locally, port value-transfer assertions to Studio mode.

## Recommendations

- Install Python 3.12+ and GenLayer contract tooling before the next contract milestone.
- Run the GenVM linter before changing contract storage or method signatures.
- Keep frontend contract calls behind a dedicated service layer.
- Add Studio-mode tests before deploying to Bradbury.
- Add ESLint and formatting before broad frontend changes.
- Add smoke tests for existing mocked UI flows.

## Next Development Steps

1. Install and verify Python 3.12+ contract tooling.
2. Run `genvm-lint check contracts/receipt.py`.
3. Run `pytest tests/contract -v`.
4. Address any official tooling feedback before deployment work.
5. Add a frontend contract service in a later milestone.
6. Deploy to Bradbury only after local and Studio-mode contract tests pass.
