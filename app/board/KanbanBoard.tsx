"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";

const COLORS: Record<string, string> = {
  high: "border-l-amber-500",
  medium: "border-l-aurora-accent",
  low: "border-l-aurora-muted",
};

export function KanbanBoard({
  columns,
  tasks,
}: {
  columns: { id: string; label: string; status: string }[];
  tasks: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [moving, setMoving] = useState<string | null>(null);

  const moveTask = async (taskId: string, status: string) => {
    setMoving(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setMoving(null);
    }
  };

  const tasksByStatus: Record<string, Record<string, unknown>[]> = {};
  for (const col of columns) {
    tasksByStatus[col.status] = tasks.filter(
      (t) => String(t.status ?? "todo") === col.status
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {columns.map((col) => {
        const colTasks = tasksByStatus[col.status] ?? [];
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-72 rounded-container bg-aurora-surface/60 border border-aurora-border flex flex-col max-h-[calc(100vh-12rem)]"
          >
            <div className="p-4 border-b border-aurora-border shrink-0">
              <h2 className="font-semibold">{col.label}</h2>
              <p className="text-sm text-aurora-muted">{colTasks.length} tasks</p>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[120px]">
              {colTasks.map((task) => {
                const priority = String(task.priority ?? "medium");
                const borderColor = COLORS[priority] ?? "border-l-aurora-accent";
                const isMoving = moving === String(task.id);

                return (
                  <div
                    key={String(task.id)}
                    className={`rounded-component bg-aurora-bg border border-aurora-border border-l-4 ${borderColor} p-4 group`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-aurora-muted shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{String(task.name ?? "")}</p>
                        {task.description ? (
                          <p className="text-xs text-aurora-muted mt-1 line-clamp-2">
                            {String(task.description)}
                          </p>
                        ) : null}
                        <select
                          className="mt-2 w-full text-xs px-2 py-1.5 rounded-component bg-aurora-surface border border-aurora-border"
                          defaultValue=""
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v) moveTask(String(task.id), v);
                          }}
                          disabled={isMoving}
                        >
                          <option value="">Move to...</option>
                          {columns
                            .filter((c) => c.status !== col.status)
                            .map((c) => (
                              <option key={c.id} value={c.status}>
                                {c.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
              {colTasks.length === 0 ? (
                <div className="rounded-component border-2 border-dashed border-aurora-border/50 p-6 text-center text-aurora-muted/60 text-sm">
                  No tasks
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
