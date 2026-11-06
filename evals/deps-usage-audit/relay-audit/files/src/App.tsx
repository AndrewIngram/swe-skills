import { Suspense } from "react";
import { RelayEnvironmentProvider, graphql, useLazyLoadQuery } from "react-relay";
import { environment } from "./RelayEnvironment";
import { ViewerHeader } from "./components/ViewerHeader";
import { ProjectList } from "./components/ProjectList";
import type { AppQuery } from "./__generated__/AppQuery.graphql";

function Home() {
  const data = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        viewer {
          ...ViewerHeader_user
          ...ProjectList_user
        }
      }
    `,
    {},
  );
  return (
    <main>
      <ViewerHeader user={data.viewer} />
      <ProjectList user={data.viewer} />
    </main>
  );
}

export function App() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<p>Loading…</p>}>
        <Home />
      </Suspense>
    </RelayEnvironmentProvider>
  );
}
