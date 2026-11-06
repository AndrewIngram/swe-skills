import { graphql, useFragment } from "react-relay";
import { Avatar } from "./Avatar";
import type { ViewerHeader_user$key } from "./__generated__/ViewerHeader_user.graphql";

export function ViewerHeader({ user }: { user: ViewerHeader_user$key }) {
  const data = useFragment(
    graphql`
      fragment ViewerHeader_user on User {
        name
        ...Avatar_user
      }
    `,
    user,
  );
  return (
    <header>
      <Avatar user={data} />
      <h1>{data.name}'s projects</h1>
    </header>
  );
}
