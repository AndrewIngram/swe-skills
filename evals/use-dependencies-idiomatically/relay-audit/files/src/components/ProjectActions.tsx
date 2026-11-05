import { graphql, useFragment, useMutation } from "react-relay";
import { ProjectCardFragment } from "./ProjectCard";
import type { ProjectCard_project$key } from "./__generated__/ProjectCard_project.graphql";
import type { ProjectActionsArchiveMutation } from "./__generated__/ProjectActionsArchiveMutation.graphql";

export function ProjectActions({ project }: { project: ProjectCard_project$key }) {
  const data = useFragment(ProjectCardFragment, project);
  const [archive, isArchiving] = useMutation<ProjectActionsArchiveMutation>(graphql`
    mutation ProjectActionsArchiveMutation($id: ID!) {
      archiveProject(id: $id) {
        id
        status
      }
    }
  `);
  if (data.status === "ARCHIVED") {
    return <span className="muted">Archived</span>;
  }
  return (
    <button disabled={isArchiving} onClick={() => archive({ variables: { id: data.id } })}>
      Archive
    </button>
  );
}
