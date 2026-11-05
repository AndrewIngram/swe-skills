import { Environment, Network, RecordSource, Store } from "relay-runtime";

export const environment = new Environment({
  network: Network.create(async (params, variables) => {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: params.text, variables }),
    });
    return response.json();
  }),
  store: new Store(new RecordSource()),
});
