# AtomizeAI

AtomizeAI is an AI-powered content atomization and approval workflow platform. It turns one master piece of content into multiple platform-native assets such as blog posts, LinkedIn posts, Twitter/X threads, emails, press releases, newsletters, and executive summaries.

The project also demonstrates the team workflow layer missing from many creator tools: generated assets keep parent-child lineage, approval state, assigned collaborators, version numbers, and audit history.

## Features

- Master content editor for transcripts, articles, announcements, and long-form drafts
- AI atomization into multiple output formats
- Auto-detect best formats for a given piece of content
- Tone, audience, and length controls
- Collaborator roles: Editor, Reviewer, Publisher, Admin
- Approval workflow: Draft, In review, Approved, Changes requested, Published
- Parent-child lineage between the master document and generated assets
- Version tracking and audit trail for edits and approvals
- Loading pipeline UI for generation progress
- Mock mode when no API key is configured, so the app can still be demoed

## Tech Stack

- React 19
- Vite
- Zustand
- Lucide React icons
- Nebius chat completions API
- Gemma model by default: `google/gemma-3-27b-it`

## Project Structure

```text
atomize-ai-final/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── store/
    │   └── useStore.js
    ├── utils/
    │   └── llm.js
    └── components/
        ├── AssetEditor.jsx
        ├── AssetEditor.module.css
        ├── AtomizeModal.jsx
        ├── AtomizeModal.module.css
        ├── Editor.jsx
        ├── Editor.module.css
        ├── LoadingOverlay.jsx
        ├── LoadingOverlay.module.css
        ├── Results.jsx
        ├── Results.module.css
        ├── Toast.jsx
        ├── ToneModal.jsx
        ├── ToneModal.module.css
        ├── Topbar.jsx
        └── Topbar.module.css
```

## How To Run Locally

Install Node.js first. Node 20 or newer is recommended.

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows Command Prompt, use:

```cmd
copy .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_NEBIUS_API_KEY=your_real_nebius_api_key
VITE_NEBIUS_MODEL=google/gemma-3-27b-it
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Running Without An API Key

If `VITE_NEBIUS_API_KEY` is not set, the app runs in mock mode. This is useful for demos, UI testing, and hackathon judging when you want the workflow to function without spending API credits.

## Build For Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Push To GitHub

Initialize Git if needed:

```bash
git init
```

Check files:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial AtomizeAI project"
```

Create a new empty repository on GitHub, then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Do not commit `.env.local`, `node_modules`, or `dist`. They are ignored by `.gitignore`.

## Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Notes For Hackathon Demo

Recommended demo flow:

1. Paste or load sample master content.
2. Click `Atomize Content`.
3. Use auto-detect or select formats manually.
4. Generate assets.
5. Open Results to show parent-child lineage.
6. Submit one asset for review.
7. Approve it.
8. Publish it.
9. Open the asset editor to show versioning and audit trail.

## Future Scope

- Persistent backend database for workspaces, assets, and approvals
- Real user authentication and role-based permissions
- Commenting and inline review notes
- Scheduled publishing integrations
- Slack/email approval reminders
- Admin dashboard for overdue approvals and escalation rules
