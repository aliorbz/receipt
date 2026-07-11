# Receipt Development Notes

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4 via `@tailwindcss/vite`
- Lucide React icons
- No wallet framework packages installed for Phase 2A

The project is still a frontend-first prototype. Phase 2A adds real injected wallet connection and wallet-based frontend identity only. Task publishing, acceptance, submission, reward locking, reputation, profiles, and GenLayer evaluation remain mocked.

## Installed Wallet Packages

None.

Phase 2A uses the browser's injected EIP-1193 provider directly through a small typed service. No Wagmi, RainbowKit, Web3Modal, ethers, Viem, or GenLayer SDK package was added because this milestone only requires wallet connect, account reads, chain reads, and chain switch/add-chain requests.

## Network Configuration

Configuration lives in `src/config/genlayer.ts`.

- Network name: GenLayer Bradbury Testnet
- GenLayer network identifier: `testnetBradbury`
- Chain ID: `4221`
- Hex chain ID: `0x107d`
- Native currency symbol: `GEN`
- GenLayer RPC: `https://rpc-bradbury.genlayer.com`
- Chain/EVM RPC: `https://rpc.testnet-chain.genlayer.com`
- Chain explorer: `https://explorer.testnet-chain.genlayer.com`

No private keys, seed phrases, API keys, or secrets are used by the frontend.

## Folder Structure

```text
src/
├── components/
│   ├── feedback/
│   │   ├── LoadingOverlay.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── FooterNav.tsx
│   │   └── Navbar.tsx
│   ├── modals/
│   │   └── PublishTaskModal.tsx
│   ├── profile/
│   │   ├── ProfileTabs.tsx
│   │   └── ScoreCard.tsx
│   └── tasks/
│       ├── StatusBadge.tsx
│       ├── SubmissionForm.tsx
│       └── TaskCard.tsx
├── config/
│   └── genlayer.ts
├── data/
│   └── mockData.ts
├── hooks/
│   └── useWallet.ts
├── screens/
│   ├── LandingScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── TaskBoardScreen.tsx
│   └── TaskDetailScreen.tsx
├── services/
│   └── walletService.ts
├── types/
│   └── index.ts
├── utils/
│   └── taskHelpers.ts
├── App.tsx
├── index.css
└── main.tsx
```

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

- No task contract calls exist yet.
- No onchain profile exists yet.
- No onchain publishing, accepting, submitting, reward locking, reputation, or GenLayer evaluation exists yet.
- There is no ESLint configuration yet; `npm run lint` currently runs `tsc --noEmit`.
- There are no automated UI tests yet.
- Browser wallet flows require manual testing in a browser with an injected wallet.

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

## Recommendations

- Add ESLint and formatting before adding contract code.
- Add smoke tests for existing mocked flows.
- Add wallet-provider test doubles for automated state testing.
- Keep GenLayer contract/RPC calls behind service modules and hooks.
- Add React Router only when real URLs are needed.

## Next Development Steps

1. Manually test injected wallet behavior against the checklist above.
2. Add automated unit tests for `walletService` and `useWallet`.
3. Define the future GenLayer contract/service boundary.
4. Implement onchain profiles in a separate milestone.
5. Implement onchain task contracts in a separate milestone.
