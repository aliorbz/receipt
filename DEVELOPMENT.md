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
.
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── DEVELOPMENT.md
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Important Components

- `src/main.tsx`: React entry point that mounts the app into `#root`.
- `src/App.tsx`: Main application shell, route state, mock task data, wallet simulation state, forms, modals, toast feedback, and all active UI screens.
- `ProfileTabs` in `src/App.tsx`: Local reusable tab component used on the profile/workspace screen.
- `src/index.css`: Tailwind import, font imports, theme tokens, scrollbar styling, and small animation helpers.

## Existing Pages

Routing is handled with local React state in `App.tsx`; there is no router library yet.

- `landing`: Public landing screen and connect wallet entry point.
- `board`: Task marketplace board with available work and workspace summary.
- `detail`: Task detail, submission, cancellation, and review actions.
- `profile`: User profile and task workspace tabs.

## Existing UI Components

The active reusable UI is currently embedded in `App.tsx`.

- Top navigation/header
- Toast notification banner
- Loading/consensus simulation overlay
- Landing sections
- Task board cards
- Task detail panels
- Publish task modal
- Submit work modal
- Profile summary
- `ProfileTabs`

## Existing Mock Data

Mock data lives in `INITIAL_TASKS_LIST` inside `src/App.tsx`.

It includes:

- Available tasks
- Accepted tasks
- Submitted tasks waiting for publisher review
- Completed tasks
- Cancelled/revision-capable workflow states
- Mock publisher names, scores, wallet addresses, deadlines, rewards, and submissions

The current user profile and connected wallet address are also mocked in `src/App.tsx`.

## Current Problems

Resolved during this cleanup:

- Removed unused AI Studio scaffold components under `src/components`.
- Removed unused `src/types.ts` and `src/mockData.ts`, which represented a separate inactive data model.
- Removed unused AI/server dependencies: `@google/genai`, `express`, `dotenv`, `motion`, `tsx`, duplicate `vite`, and Express types.
- Removed AI Studio metadata capability for server-side Gemini.
- Replaced the default HTML title with `Receipt`.
- Cleaned `.env.example` so it no longer suggests Gemini or hosted AI Studio variables.
- Made the `clean` script work cross-platform.
- Added `.npm-cache/` to `.gitignore` because local install verification used a project-local npm cache.
- Cleaned garbled AI Studio comments in `vite.config.ts`.

Remaining known issues:

- `App.tsx` is very large and contains data, state, actions, pages, and UI in one file.
- Mock workflow copy mentions simulated on-chain and consensus activity, but there is no blockchain implementation yet.
- Date values are static mock data.
- No automated UI tests are present.
- No ESLint setup is present; `npm run lint` currently runs TypeScript only.

## Recommendations

- Keep the current UI stable while extracting code in small steps.
- Move domain types into `src/types.ts` after the final frontend data model is agreed.
- Move mock data into `src/mockData.ts` using the active `Task` shape from `App.tsx`.
- Split `App.tsx` into route-level screen components only after behavior is documented and covered.
- Add ESLint and formatting rules before the codebase grows.
- Add lightweight smoke tests for page rendering and the main mock workflows.
- Introduce real routing later only if route URLs are needed.
- Add Web3/GenLayer integration behind service modules, not directly inside UI components.

## Next Development Steps

1. Confirm the current frontend flow and copy are the desired product baseline.
2. Extract active types and mock data from `App.tsx` without changing behavior.
3. Extract screen components from `App.tsx` while preserving markup and styling.
4. Add ESLint, formatting, and basic smoke tests.
5. Define the GenLayer integration boundary and environment variables.
6. Implement wallet and testnet interactions only after the frontend structure is stable.
