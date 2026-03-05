import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { FolderKanban, LayoutGrid, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProjects() {
  const client = createAuroraClient();
  const { data } = await client.tables("projects").records.list({
    limit: 10,
    sort: "created_at",
    order: "desc",
  });
  return data ?? [];
}

export default async function HomePage() {
  let projects: Record<string, unknown>[] = [];
  try {
    projects = await getProjects();
  } catch {
    /* show empty */
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Project Management</h1>
        <p className="text-aurora-muted text-lg max-w-2xl">
          Organize work with Kanban boards. Track tasks from To Do to Done.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Link
          href="/board"
          className="rounded-container bg-aurora-surface border border-aurora-border p-6 hover:border-aurora-accent/40 transition-colors group"
        >
          <LayoutGrid className="w-12 h-12 text-aurora-accent/60 mb-4" />
          <h2 className="text-xl font-semibold mb-2 group-hover:text-aurora-accent">Board</h2>
          <p className="text-aurora-muted text-sm mb-4">
            Kanban view of all tasks. Drag cards between columns.
          </p>
          <span className="text-aurora-accent text-sm font-medium flex items-center gap-2">
            Open board
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <Link
          href="/projects"
          className="rounded-container bg-aurora-surface border border-aurora-border p-6 hover:border-aurora-accent/40 transition-colors group"
        >
          <FolderKanban className="w-12 h-12 text-aurora-accent/60 mb-4" />
          <h2 className="text-xl font-semibold mb-2 group-hover:text-aurora-accent">Projects</h2>
          <p className="text-aurora-muted text-sm mb-4">
            {projects.length} project{projects.length !== 1 ? "s" : ""} — view and manage.
          </p>
          <span className="text-aurora-accent text-sm font-medium flex items-center gap-2">
            View projects
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <Link
          href="/members"
          className="rounded-container bg-aurora-surface border border-aurora-border p-6 hover:border-aurora-accent/40 transition-colors group"
        >
          <Users className="w-12 h-12 text-aurora-accent/60 mb-4" />
          <h2 className="text-xl font-semibold mb-2 group-hover:text-aurora-accent">Team</h2>
          <p className="text-aurora-muted text-sm mb-4">
            Team members and their roles.
          </p>
          <span className="text-aurora-accent text-sm font-medium flex items-center gap-2">
            View team
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-6">
          <h2 className="font-semibold mb-4">Recent projects</h2>
          <ul className="space-y-2">
            {projects.slice(0, 5).map((p) => (
              <li key={String(p.id)}>
                <Link
                  href={`/board?project=${p.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-component hover:bg-aurora-bg/50"
                >
                  <span className="font-medium">{String(p.name ?? "")}</span>
                  <span className="text-aurora-muted text-sm">
                    {String(p.status ?? "active")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
