import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProjects() {
  const client = createAuroraClient();
  const { data } = await client.tables("projects").records.list({
    limit: 50,
    sort: "created_at",
    order: "desc",
  });
  return data ?? [];
}

export default async function ProjectsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${String(process.env.NEXT_PUBLIC_AURORA_API_URL).replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/projects`
      : null;

  let projects: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    projects = await getProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load projects";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <FolderKanban className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No projects yet</p>
          <p className="text-sm text-aurora-muted mb-6">
            Add projects in Aurora Studio or run the seed script.
          </p>
          {studioUrl ? (
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
            >
              Add in Aurora Studio →
            </a>
          ) : null}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={String(p.id)}
              href={`/board?project=${p.id}`}
              className="rounded-container bg-aurora-surface border border-aurora-border p-6 hover:border-aurora-accent/40 transition-colors"
            >
              <FolderKanban className="w-10 h-10 text-aurora-accent/60 mb-4" />
              <h2 className="font-semibold text-lg mb-2">{String(p.name ?? "")}</h2>
              {p.description ? (
                <p className="text-aurora-muted text-sm line-clamp-2">{String(p.description)}</p>
              ) : null}
              <span
                className={`inline-block mt-4 px-2 py-1 rounded text-xs ${
                  String(p.status ?? "") === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : String(p.status ?? "") === "on_hold"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-aurora-accent/20 text-aurora-accent"
                }`}
              >
                {String(p.status ?? "active")}
              </span>
            </Link>
          ))}
        </div>
      )}

      {studioUrl ? (
        <div className="mt-8">
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="text-aurora-accent hover:underline text-sm">
            Manage in Aurora Studio →
          </a>
        </div>
      ) : null}
    </div>
  );
}
