import type Infer from "#Infer";
import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";
import error from "#error";
import expected from "#expected";
import is_uint from "#is-uint";
import assert from "@rcompat/assert";

export default class UintType
  extends PrimitiveType<number | bigint, "UintType">
  implements Storeable<"u64"> {

  constructor() {
    super("uint");
  }

  get datatype() {
    return "u64" as const;
  }

  normalize(value: number | bigint) {
    assert(is_uint(value));

    if (typeof value === "number") {
      return BigInt(value);
    }

    return value;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!is_uint(x) || x < 0) {
      throw new Error(error(expected("uint", x), key));
    }

    return x as Infer<this>;
  }
}
