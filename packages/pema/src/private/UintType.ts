import type Infer from "#Infer";
import PrimitiveType from "#PrimitiveType";
import error from "#error";
import expected from "#expected";
import is_int from "#is-int";

type Name = "UintType";

export default class UintType extends PrimitiveType<number | bigint, Name> {
  constructor() {
    super("uint");
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!is_int(x) || x < 0) {
      throw new Error(error(expected("uint", x), key));
    }

    return x as Infer<this>;
  }
}
