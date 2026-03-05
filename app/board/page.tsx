import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { KanbanBoard } from "./KanbanBoard";
import { ProjectFilter } from "./ProjectFilter";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { id: "todo", label: "To Do", status: "todo" },
  { id: "in_progress", label: "In Progress", status: "in_progress" },
  { id: "review", label: "Review", status: "review" },
  { id: "done", label: "Done", status: "done" },
];

async function getBoardData(projectId?: string) {
  const client = createAuroraClient();
  const [tasksRes, projectsRes, projectMap] = await Promise.all([
    client.tables("tasks").records.list({ limit: 200 }),
    client.tables("projects").records.list({ limit: 50 }),
    projectId
      ? client.tables("projects").records.get(projectId).catch(() => null)
      : Promise.resolve(null),
  ]);

  const tasks = (tasksRes as { data?: Record<string, unknown>[] }).data ?? [];
  const projects = (projectsRes as { data?: Record<string, unknown>[] }).data ?? [];

  let filteredTasks = tasks;
  if (projectId) {
    filteredTasks = tasks.filter((t) => String(t.project_id ?? "") === projectId);
  }

  return {
    tasks: filteredTasks,
    projects,
    currentProject: projectMap as Record<string, unknown> | null,
  };
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  let tasks: Record<string, unknown>[] = [];
  let projects: Record<string, unknown>[] = [];
  let currentProject: Record<string, unknown> | null = null;
  let error: string | null = null;

  try {
    const data = await getBoardData(project);
    tasks = data.tasks;
    projects = data.projects;
    currentProject = data.currentProject;
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load board";
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-aurora-muted hover:text-white text-sm mb-2 inline-block">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold">
            {currentProject ? String(currentProject.name ?? "Board") : "Board"}
          </h1>
        </div>
        <ProjectFilter projects={projects} currentProjectId={project ?? null} />
      </div>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : (
        <KanbanBoard columns={COLUMNS} tasks={tasks} />
      )}
    </div>
  );
}
