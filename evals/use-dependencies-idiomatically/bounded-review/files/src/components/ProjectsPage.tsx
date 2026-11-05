import { useEffect, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../lib/schemas";
import { ProjectRow } from "./ProjectRow";

export function ProjectsPage() {
  const { data, isPending, error } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  const visible = showArchived ? projects : projects.filter((p) => p.status !== "archived");

  return (
    <main>
      <label>
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        Show archived
      </label>
      <table>
        <tbody>
          {visible.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </main>
  );
}
