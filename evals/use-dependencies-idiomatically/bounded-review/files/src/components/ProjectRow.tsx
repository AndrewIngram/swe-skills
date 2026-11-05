import { useState } from "react";
import { format } from "date-fns";
import type { Project } from "../lib/schemas";
import { timeAgo } from "../lib/time";
import { EditProjectForm } from "./EditProjectForm";

export function ProjectRow({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  return (
    <tr>
      <td>{project.name}</td>
      <td>{project.status}</td>
      <td title={format(new Date(project.updatedAt), "d MMM yyyy, HH:mm")}>
        {timeAgo(project.updatedAt)}
      </td>
      <td>
        {editing ? (
          <EditProjectForm project={project} onDone={() => setEditing(false)} />
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </td>
    </tr>
  );
}
