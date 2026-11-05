import { graphql, useFragment } from "react-relay";
import type { MemberCount_project$key } from "./__generated__/MemberCount_project.graphql";

export function MemberCount({ project }: { project: MemberCount_project$key }) {
  const data = useFragment(
    graphql`
      fragment MemberCount_project on Project {
        memberCount
      }
    `,
    project,
  );
  return <span className="member-count">{data.memberCount} members</span>;
}
