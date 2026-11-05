/**
 * @generated SignedSource<<e3556e720c2126f2bcd7fabf7a4fa9a8>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ViewerHeader_user$data = {
  readonly name: string;
  readonly " $fragmentSpreads": FragmentRefs<"Avatar_user">;
  readonly " $fragmentType": "ViewerHeader_user";
};
export type ViewerHeader_user$key = {
  readonly " $data"?: ViewerHeader_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"ViewerHeader_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewerHeader_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Avatar_user"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "c04ce00c8a65818f32653c5c4c611110";

export default node;
