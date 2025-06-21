import type Infer from "#Infer";
import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";
import error from "#error";
import expected from "#expected";
import is_int from "#is-int";
import assert from "@rcompat/assert";

export default class IntType
  extends PrimitiveType<number | bigint, "IntType">
  implements Storeable<"i64"> {

  constructor() {
    super("int");
  }

  get datatype() {
    return "i64" as const;
  }

  normalize(value: number | bigint) {
    assert(is_int(value));

    if (typeof value === "number") {
      return BigInt(value);
    }

    return value;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!is_int(x)) {
      throw new Error(error(expected("int", x), key));
    }

    return x as Infer<this>;
  }
}
