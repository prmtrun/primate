import type Validated from "#Validated";

type Schema =
  Validated<unknown> |
  Schema[] |
  null |
  undefined |
  { [k: string]: Schema };

export type { Schema as default };
