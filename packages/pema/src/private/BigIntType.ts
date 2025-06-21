import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";

export default class BigIntType
  extends PrimitiveType<bigint, "BigIntType">
  implements Storeable<"i64"> {

  constructor() {
    super("bigint");
  }

  get datatype() {
    return "i64" as const;
  }

  normalize(value: bigint) {
    return value;
  }
}
