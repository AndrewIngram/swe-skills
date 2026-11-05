/**
 * @generated SignedSource<<ba9b072d6d56471d5c5438886118728e>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "PAUSED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ProjectCard_project$data = {
  readonly id: string;
  readonly name: string;
  readonly owner: {
    readonly avatarUrl: string | null | undefined;
    readonly id: string;
    readonly name: string;
  };
  readonly status: ProjectStatus;
  readonly updatedAt: string;
  readonly " $fragmentSpreads": FragmentRefs<"MemberCount_project">;
  readonly " $fragmentType": "ProjectCard_project";
};
export type ProjectCard_project$key = {
  readonly " $data"?: ProjectCard_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectCard_project">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectCard_project",
  "selections": [
    (v0/*:: as any*/),
    (v1/*:: as any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "updatedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "owner",
      "plural": false,
      "selections": [
        (v0/*:: as any*/),
        (v1/*:: as any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatarUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MemberCount_project"
    }
  ],
  "type": "Project",
  "abstractKey": null
};
})();

(node as any).hash = "54d19f213104841b456279f439e2dd5b";

export default node;
