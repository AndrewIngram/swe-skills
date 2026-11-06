/**
 * @generated SignedSource<<688a66efb9a79cfe88d2eceb97101fa4>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "PAUSED" | "%future added value";
export type ProjectActionsArchiveMutation$variables = {
  id: string;
};
export type ProjectActionsArchiveMutation$data = {
  readonly archiveProject: {
    readonly id: string;
    readonly status: ProjectStatus;
  } | null | undefined;
};
export type ProjectActionsArchiveMutation = {
  response: ProjectActionsArchiveMutation$data;
  variables: ProjectActionsArchiveMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Project",
    "kind": "LinkedField",
    "name": "archiveProject",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectActionsArchiveMutation",
    "selections": (v1/*:: as any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ProjectActionsArchiveMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "d728a1260fab06b49a8ae546765f8f20",
    "id": null,
    "metadata": {},
    "name": "ProjectActionsArchiveMutation",
    "operationKind": "mutation",
    "text": "mutation ProjectActionsArchiveMutation(\n  $id: ID!\n) {\n  archiveProject(id: $id) {\n    id\n    status\n  }\n}\n"
  }
};
})();

(node as any).hash = "007bf20b8d5ac7fa0fe5f4ab25dbe405";

export default node;
