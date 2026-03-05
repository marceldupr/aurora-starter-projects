#!/usr/bin/env node
/**
 * Seed script for aurora-starter-projects.
 * Run after schema provisioning.
 *
 * Usage: AURORA_API_URL=... AURORA_API_KEY=... node scripts/seed.mjs
 */

const apiUrl = process.env.AURORA_API_URL || process.env.NEXT_PUBLIC_AURORA_API_URL;
const apiKey = process.env.AURORA_API_KEY;

if (!apiUrl || !apiKey) {
  console.error("Set AURORA_API_URL and AURORA_API_KEY");
  process.exit(1);
}

const base = apiUrl.replace(/\/$/, "");

async function createRecord(table, data) {
  const res = await fetch(`${base}/v1/tables/${table}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`${table} create failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function seed() {
  console.log("Seeding aurora-starter-projects...");

  // 1. Projects
  const projects = [
    { name: "Website Redesign", description: "Full refresh of company website.", status: "active" },
    { name: "Mobile App", description: "iOS and Android app development.", status: "active" },
  ];
  const createdProjects = [];
  for (const p of projects) {
    const rec = await createRecord("projects", p);
    createdProjects.push(rec);
    console.log("  Created project:", p.name);
  }

  // 2. Sprints
  const sprints = [
    { name: "Sprint 1", project_id: createdProjects[0].id, status: "active" },
    { name: "Sprint 2", project_id: createdProjects[0].id, status: "planned" },
  ];
  const createdSprints = [];
  for (const s of sprints) {
    const rec = await createRecord("sprints", s);
    createdSprints.push(rec);
    console.log("  Created sprint:", s.name);
  }

  // 3. Tasks
  const tasks = [
    { name: "Design homepage mockups", description: "Create Figma mockups for new homepage.", project_id: createdProjects[0].id, sprint_id: createdSprints[0].id, status: "in_progress", priority: "high" },
    { name: "Set up component library", description: "Establish design system components.", project_id: createdProjects[0].id, sprint_id: createdSprints[0].id, status: "done", priority: "high" },
    { name: "User research", description: "Conduct 5 user interviews.", project_id: createdProjects[0].id, sprint_id: createdSprints[0].id, status: "todo", priority: "medium" },
    { name: "API integration", description: "Connect to backend APIs.", project_id: createdProjects[0].id, sprint_id: createdSprints[0].id, status: "review", priority: "high" },
    { name: "App icons", description: "Design and export app icons.", project_id: createdProjects[1].id, status: "todo", priority: "low" },
  ];
  for (const t of tasks) {
    await createRecord("tasks", t);
    console.log("  Created task:", t.name);
  }

  // 4. Members
  const members = [
    { name: "Alex Developer", email: "alex@team.com", role: "developer" },
    { name: "Sam Designer", email: "sam@team.com", role: "designer" },
    { name: "Jordan Manager", email: "jordan@team.com", role: "manager" },
  ];
  for (const m of members) {
    await createRecord("members", m);
    console.log("  Created member:", m.name);
  }

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
