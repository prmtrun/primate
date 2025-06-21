import type Storeable from "#Storeable";

type StoreSchema =
  /*{ id: Storeable<any> } &*/
  { [k: string]: Storeable<any> };

export type { StoreSchema as default };
