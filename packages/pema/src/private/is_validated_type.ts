import type Validated from "#Validated";
import ValidatedKey from "#ValidatedKey";

export default (x: unknown): x is Validated<unknown> => {
  return !!x && typeof x === "object" && ValidatedKey in x;
};
