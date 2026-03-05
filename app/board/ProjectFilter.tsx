"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProjectFilter({
  projects,
  currentProjectId,
}: {
  projects: Record<string, unknown>[];
  currentProjectId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (projects.length <= 1) return null;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("project", value);
    } else {
      params.delete("project");
    }
    router.push(value ? `/board?project=${value}` : "/board");
  };

  return (
    <select
      className="px-4 py-2 rounded-component bg-aurora-surface border border-aurora-border"
      value={currentProjectId ?? ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">All projects</option>
      {projects.map((p) => (
        <option key={String(p.id)} value={String(p.id)}>
          {String(p.name ?? "")}
        </option>
      ))}
    </select>
  );
}
