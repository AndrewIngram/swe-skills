import { graphql, useFragment } from "react-relay";
import { OwnerBadge } from "./OwnerBadge";
import { ProjectActions } from "./ProjectActions";
import { MemberCount } from "./MemberCount";
import type { ProjectCard_project$key } from "./__generated__/ProjectCard_project.graphql";

export const ProjectCardFragment = graphql`
  fragment ProjectCard_project on Project {
    id
    name
    status
    updatedAt
    owner {
      id
      name
      avatarUrl
    }
    ...MemberCount_project
  }
`;

export function ProjectCard({ project }: { project: ProjectCard_project$key }) {
  const data = useFragment(ProjectCardFragment, project);
  return (
    <article className="project-card">
      <h2>{data.name}</h2>
      <OwnerBadge owner={data.owner} />
      <MemberCount project={data} />
      <ProjectActions project={project} />
    </article>
  );
}
