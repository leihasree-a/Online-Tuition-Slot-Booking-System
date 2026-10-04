# TuitionHub

**Online Tuition Management System**  
*Manage learning. Simplify tuition.*

TuitionHub is a responsive frontend demonstration for managing a tuition program. It brings student and tutor directories, schedules, bookings, fee status, attendance, and workspace preferences into one interface. All current records and actions are mock, in-memory data; reloading the app resets changes.

## Member 3 Responsibilities

This project covers the frontend/UI scope: application navigation, login presentation, dashboard, student and tutor management screens, availability schedule, class booking flow, fee management UI, attendance UI, settings, responsive behavior, and reusable visual components. Login, booking, payment, and save interactions are demonstrations only.

## Technology

- React 18
- Vite 6
- JavaScript (ES modules)
- Lucide React icons
- CSS

No database, JDBC, API server, backend authentication, conflict detection, or payment processing is included.

## Features

- Responsive dashboard with summary metrics and upcoming classes
- Mock login with password visibility and frontend-only navigation
- Student search, status filter, add/edit validation, and delete confirmation
- Tutor directory with subject and availability details
- Weekly availability grid with available, unavailable, and selected states
- Multi-step booking with a confirmation summary
- Fee summaries and mock record-payment action
- Class/date attendance register with Present, Absent, and Late states
- Profile, notification, preference, and appearance settings
- Search, notification popover, success/error feedback, and responsive navigation

## Folder Structure

```text
OnlineTuitionManagementSystem/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── assets/
    ├── components/
    │   ├── Brand.jsx
    │   └── Ui.jsx
    ├── data/
    │   └── mockData.js
    ├── pages/
    │   └── Workspace.jsx
    ├── styles/
    │   └── global.css
    └── utils/
        └── mockService.js
```

`src/data/mockData.js` is the single source for demonstration records. `src/utils/mockService.js` is a small frontend service boundary; when the backend is ready, replace its mock functions with calls to the team's agreed integration without coupling the UI to a database. `src/App.jsx` mounts the workspace; the views and frontend-only state are composed in `src/pages/Workspace.jsx`, and reusable UI pieces live in `src/components/`.

## How to Run

Install Node.js (18 or newer), then from this project directory run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Sign in using any non-empty email and password; credentials are not checked or saved.

## How to Build

```bash
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`. `dist/` and `node_modules/` are excluded from Git.

## Export / Download

Keep the project folder (or download/extract its ZIP) to retain the source code. For a production static-site export, run `npm run build` and package the generated `dist/` directory. Do not distribute `node_modules/`.

## Push to GitHub

Create an empty repository on GitHub, then from this project directory:

```bash
git init
git add .
git commit -m "Build TuitionHub frontend"
git branch -M main
git remote add origin https://github.com/<your-account>/<repository>.git
git push -u origin main
```

If the project is already in a Git repository, skip `git init` and preserve the existing remote/branch setup. Review staged files before committing. Do not commit credentials or environment files.

## Future Backend Integration Notes

- Keep presentation components focused on display and user interaction.
- Replace `mockService` functions with the backend team's agreed service calls.
- Agree on request/response shapes and loading/error states with Members 1 and 2 before connecting forms.
- Authentication, student/tutor records, schedule rules, booking conflicts, payments, and persistence must remain owned by the backend team.
- Never place database credentials, payment secrets, or server-only logic in this frontend repository.
