import type Infer from "#Infer";
import PrimitiveType from "#PrimitiveType";
import error from "#error";
import expected from "#expected";
import is_int from "#is-int";

export default class IntType extends PrimitiveType<number | bigint, "IntType"> {
  constructor() {
    super("int");
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!is_int(x)) {
      throw new Error(error(expected("int", x), key));
    }

    return x as Infer<this>;
  }
}
