import type { Project, ProjectInput } from "./schemas";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`);
  return (await res.json()) as Project[];
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to save project: ${res.status}`);
}
