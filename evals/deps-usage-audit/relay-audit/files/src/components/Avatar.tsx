import { graphql, useFragment } from "react-relay";
import type { Avatar_user$key } from "./__generated__/Avatar_user.graphql";

export function Avatar({ user }: { user: Avatar_user$key }) {
  const data = useFragment(
    graphql`
      fragment Avatar_user on User {
        name
        avatarUrl
      }
    `,
    user,
  );
  return data.avatarUrl ? (
    <img className="avatar" src={data.avatarUrl} alt={data.name} />
  ) : (
    <span className="avatar avatar--initials">{data.name.slice(0, 1)}</span>
  );
}
