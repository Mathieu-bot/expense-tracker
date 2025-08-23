<div align="center">
  <h1 style="margin-bottom: 0.25rem;">Expense Tracker Client</h1>
  <p style="margin-top: 0; color: #6b7280;">Modern React + TypeScript + Vite frontend with a reusable UI library and Storybook docs.</p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss&logoColor=white" />
    <img alt="Storybook" src="https://img.shields.io/badge/Storybook-8-ff4785?logo=storybook&logoColor=white" />
  </p>
</div>

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Storybook

## Requirements

- Node.js >= 18
- pnpm, npm, or yarn (examples below use npm)

<h2>Scripts</h2>

- dev server: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`
- storybook: `npm run storybook`

<h2>API Client SDK</h2>

- Regenerate the client from the server OpenAPI spec:

```bash
npm run api:generate
```

- Source spec: `server/docs/Expense Tracker API.yaml`

<h2>UI Components Overview (<code>client/src/ui/</code>)</h2>

- Tooltip (`Tooltip.tsx`)
  - Uses shared positioning hook `useAnchoredPopover` for smart placement (top/bottom/left/right), flip and clamp to viewport.
  - A11y: `role="tooltip"`, dynamic `aria-describedby`, subtle motion to reduce distraction.
  - Docs: see `Tooltip.stories.tsx` for placements, delays, disabled listeners, custom classes.

- Dialog (`Dialog.tsx`)
  - Modal centered with backdrop, ESC to close, optional overlay click to close, scroll lock.
  - Content is flexible: supports cards, long lists (use an inner `max-h-[60vh] overflow-auto`).
  - Docs: see `Dialog.stories.tsx` including cards grid and long list examples (copy-paste code provided in docs panel).

- DatePicker, Select, Skeleton, TextField, Button, Toast, IconButton
  - See respective `*.stories.tsx` for usage.

<h3>Shared hooks and constants</h3>
- `hooks/useAnchoredPopover.ts`: shared anchor-based popover positioning for tooltips/menus/popovers.
- `constants/tooltip.ts` and other files in `constants/`: centralized Tailwind classes and UI tokens.

<h2>Folder Structure (excerpt)</h2>

```
client/
  src/ui/
    Tooltip.tsx
    Dialog.tsx
    hooks/useAnchoredPopover.ts
    constants/tooltip.ts
    *.stories.tsx
```

<h2>Accessibility</h2>

- Components aim for sensible roles/aria attributes and keyboard support (e.g., ESC for dialogs).
- Prefer linking labels with `aria-labelledby` / `aria-describedby` where relevant.

<h2>Design & Styling</h2>

- Styling via Tailwind utility classes. Shared tokens live under `src/ui/constants/`.

<h2>Storybook</h2>

- Run `npm run storybook` and open the browser UI.
- Each story exposes a “Show code”/Docs panel with copy‑paste snippets for quick adoption.

<!-- Internal workflows and branching strategies are managed at the repository level. -->

