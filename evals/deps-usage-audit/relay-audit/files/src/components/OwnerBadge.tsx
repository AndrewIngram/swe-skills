import type { ProjectCard_project$data } from "./__generated__/ProjectCard_project.graphql";

type Props = {
  owner: ProjectCard_project$data["owner"];
};

export function OwnerBadge({ owner }: Props) {
  return (
    <span className="owner-badge">
      {owner.avatarUrl && <img src={owner.avatarUrl} alt="" />}
      {owner.name}
    </span>
  );
}
