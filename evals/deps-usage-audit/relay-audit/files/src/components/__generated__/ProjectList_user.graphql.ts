/**
 * @generated SignedSource<<f55bd7c4ae420f2bed76f8255358c5bb>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectList_user$data = {
  readonly id: string;
  readonly projects: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"ProjectCard_project">;
      };
    }>;
  };
  readonly " $fragmentType": "ProjectList_user";
};
export type ProjectList_user$key = {
  readonly " $data"?: ProjectList_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectList_user">;
};

import ProjectListPaginationQuery_graphql from './ProjectListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "projects"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "after"
    },
    {
      "defaultValue": 20,
      "kind": "LocalArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*:: as any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*:: as any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": ProjectListPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "ProjectList_user",
  "selections": [
    {
      "alias": "projects",
      "args": null,
      "concreteType": "ProjectConnection",
      "kind": "LinkedField",
      "name": "__ProjectList_projects_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ProjectEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Project",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*:: as any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ProjectCard_project"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v1/*:: as any*/)
  ],
  "type": "User",
  "abstractKey": null
};
})();

(node as any).hash = "47bb4dec79e1c7817979e86b42975b2d";

export default node;
