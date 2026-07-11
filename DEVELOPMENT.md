# Receipt Development Notes

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4 via `@tailwindcss/vite`
- Lucide React icons

The project is currently a frontend-only prototype. It does not include wallet integrations, GenLayer RPC calls, backend services, or smart contracts.

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
│   │   ├── PublishTaskModal.tsx
│   │   └── SubmitWorkModal.tsx
│   ├── profile/
│   │   ├── ProfileTabs.tsx
│   │   └── ScoreCard.tsx
│   └── tasks/
│       ├── StatusBadge.tsx
│       ├── SubmissionForm.tsx
│       └── TaskCard.tsx
├── data/
│   └── mockData.ts
├── screens/
│   ├── LandingScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── TaskBoardScreen.tsx
│   └── TaskDetailScreen.tsx
├── types/
│   └── index.ts
├── utils/
│   └── taskHelpers.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Important Components

- `src/App.tsx`: Small application coordinator for current page, selected task, wallet simulation, shared task state, modals, forms, and mock workflow handlers.
- `src/screens/LandingScreen.tsx`: Public landing view and primary entry action.
- `src/screens/TaskBoardScreen.tsx`: Available task list, connected task list, and publish entry point.
- `src/screens/TaskDetailScreen.tsx`: Task detail, self-accept prevention, accept/cancel/submit/review mock workflows.
- `src/screens/ProfileScreen.tsx`: Profile summary, Client Score, Contributor Score, recent receipts, and profile tabs.
- `src/components/layout/Navbar.tsx`: Header navigation and account dropdown.
- `src/components/modals/PublishTaskModal.tsx`: Controlled publish task form.
- `src/components/modals/SubmitWorkModal.tsx`: Controlled global submit form retained for modal workflow support.
- `src/components/tasks/SubmissionForm.tsx`: Inline submit form used on the task detail screen.
- `src/components/profile/ProfileTabs.tsx`: Accepted, Published, and Completed task tabs.

## Existing Pages

Routing is still local React state; React Router has not been added.

- `landing`
- `board`
- `detail`
- `profile`

## Existing UI Components

- Navbar
- Footer navigation
- Toast
- Loading/consensus overlay
- Task cards
- Status badges
- Publish task modal
- Submit work modal
- Inline submission form
- Profile score cards
- Profile tabs

## Existing Mock Data

Mock data now lives in `src/data/mockData.ts`.

It includes:

- `CURRENT_USER_ADDRESS`
- `INITIAL_USER_PROFILE`
- `INITIAL_TASKS_LIST`

The active model uses `clientScore` and `contributorScore`. The task shape still keeps existing client address fields so it can later be extended with on-chain IDs, contributor wallets, transaction hashes, and contract status without changing the UI contracts now.

## Current Problems

Resolved in this refactor:

- Split the oversized `src/App.tsx` into screens, components, data, types, and helpers.
- Removed unused `metadata.json`; it was AI Studio metadata and was not referenced anywhere in the application or package scripts.
- Moved active domain types into `src/types/index.ts`.
- Moved active mock data into `src/data/mockData.ts`.
- Moved pure task filtering/status helpers into `src/utils/taskHelpers.ts`.
- Normalized visible score labels to Client Score and Contributor Score.
- Kept the local mock navigation model and did not add React Router.

Remaining known issues:

- There is no ESLint configuration yet; `npm run lint` currently runs `tsc --noEmit`.
- There are no automated UI tests yet.
- Some mock workflow copy still references simulated network/escrow behavior, but no blockchain code exists.
- `SubmitWorkModal` is retained for the existing global modal path, though the visible flow primarily uses the inline detail form.

## Recommendations

- Add ESLint and formatting before adding wallet or GenLayer integration.
- Add smoke tests for the landing, task board, task detail, publish, accept, cancel, submit, and profile flows.
- Keep Web3 integration behind service modules and hooks, not directly inside screen components.
- Add React Router only when real URLs are needed.
- Keep task/client/contributor terminology stable before connecting contract data.

## Next Development Steps

1. Confirm the refactored frontend matches the original UI and mock workflows.
2. Add linting and smoke-test coverage.
3. Define the wallet and GenLayer service boundaries.
4. Add environment variable names for testnet endpoints.
5. Implement wallet and GenLayer functionality in a separate integration step.
