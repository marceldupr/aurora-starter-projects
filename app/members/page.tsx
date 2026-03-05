import { createAuroraClient } from "@/lib/aurora";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getMembers() {
  const client = createAuroraClient();
  const { data } = await client.tables("members").records.list({
    limit: 50,
    sort: "name",
  });
  return data ?? [];
}

export default async function MembersPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${String(process.env.NEXT_PUBLIC_AURORA_API_URL).replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/members`
      : null;

  let teamMembers: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    teamMembers = await getMembers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load members";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Team</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <Users className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No team members yet</p>
          <p className="text-sm text-aurora-muted">
            Add members in Aurora Studio or run the seed script.
          </p>
          {studioUrl ? (
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
            >
              Add in Aurora Studio →
            </a>
          ) : null}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((m) => (
            <div
              key={String(m.id)}
              className="rounded-container bg-aurora-surface border border-aurora-border p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
                <span className="text-aurora-accent font-bold text-lg">
                  {String(m.name ?? "?")[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{String(m.name ?? "")}</p>
                {m.email != null && m.email !== "" ? (
                  <a
                    href={`mailto:${String(m.email)}`}
                    className="text-sm text-aurora-accent hover:underline"
                  >
                    {String(m.email)}
                  </a>
                ) : null}
                {m.role != null && m.role !== "" ? (
                  <span className="block mt-2 px-2 py-0.5 rounded bg-aurora-accent/20 text-aurora-accent text-xs">
                    {String(m.role)}
                  </span>
                ) : null}
              </div>
            </div>
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
