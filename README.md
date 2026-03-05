# Aurora Starter — Projects

Trello-style Kanban for projects, sprints and tasks. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Features

- **Board** — Kanban columns (To Do, In Progress, Review, Done). Move tasks between columns.
- **Projects** — Project list, filter board by project
- **Team** — Team members with roles
- **Holmes** — AI-ready (script included when configured)

## Setup

1. Clone and install: `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Set `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
4. Provision schema: `pnpm schema:provision`
5. (Optional) Seed: `pnpm seed`
6. Run: `pnpm dev`

## Tables

- **projects** — name, description, status (active/on_hold/completed)
- **sprints** — name, project, dates, status
- **tasks** — name, description, project, sprint, status (todo/in_progress/review/done), priority
- **members** — name, email, role

## Workflows

- `task.completed` → notify owners
