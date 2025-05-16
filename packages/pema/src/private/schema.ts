import type Validated from "#Validated";
import type AbstractConstructor from "@rcompat/type/AbstractConstructor";

type Schema =
  Validated<unknown> |
  Schema[] |
  null |
  undefined |
  string |
  AbstractConstructor |
  { [k: string]: Schema };

export type { Schema as default };
