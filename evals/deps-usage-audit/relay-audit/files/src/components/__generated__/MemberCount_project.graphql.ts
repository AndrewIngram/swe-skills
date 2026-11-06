/**
 * @generated SignedSource<<084556c494949f80f9721755e46499f7>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberCount_project$data = {
  readonly memberCount: number;
  readonly " $fragmentType": "MemberCount_project";
};
export type MemberCount_project$key = {
  readonly " $data"?: MemberCount_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberCount_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberCount_project",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "memberCount",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "541526f2fd236269457de20fa93fb3e3";

export default node;
