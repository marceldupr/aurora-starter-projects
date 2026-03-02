# Aurora Starter — Project Management

Projects, sprints, tasks & team. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Setup

1. Clone and install: `pnpm install`
2. Set env vars: `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
3. Run: `pnpm dev` (port 3005)
4. Schema provisions on first run via instrumentation

## Tables

- **projects** — name, description, status
- **sprints** — name, project, start/end dates, status
- **tasks** — name, project, sprint, status, priority
- **members** — name, email, role

## Workflows

- `task.completed` → notify
