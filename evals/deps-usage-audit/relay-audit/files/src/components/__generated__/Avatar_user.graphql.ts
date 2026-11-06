/**
 * @generated SignedSource<<07dbf07d950b4a8233f797220cb84fc9>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Avatar_user$data = {
  readonly avatarUrl: string | null | undefined;
  readonly name: string;
  readonly " $fragmentType": "Avatar_user";
};
export type Avatar_user$key = {
  readonly " $data"?: Avatar_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Avatar_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Avatar_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "d4ef69eb3f93cc2391d20e0452568f1f";

export default node;
