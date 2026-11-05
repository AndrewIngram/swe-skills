import { graphql, usePaginationFragment } from "react-relay";
import { ProjectCard } from "./ProjectCard";
import type { ProjectList_user$key } from "./__generated__/ProjectList_user.graphql";

export function ProjectList({ user }: { user: ProjectList_user$key }) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment ProjectList_user on User
      @argumentDefinitions(first: { type: "Int", defaultValue: 20 }, after: { type: "String" })
      @refetchable(queryName: "ProjectListPaginationQuery") {
        projects(first: $first, after: $after) @connection(key: "ProjectList_projects") {
          edges {
            node {
              id
              ...ProjectCard_project
            }
          }
        }
      }
    `,
    user,
  );
  return (
    <section>
      <ul className="project-list">
        {data.projects.edges.map((edge) => (
          <li key={edge.node.id}>
            <ProjectCard project={edge.node} />
          </li>
        ))}
      </ul>
      {hasNext && (
        <button onClick={() => loadNext(20)} disabled={isLoadingNext}>
          Load more
        </button>
      )}
    </section>
  );
}
