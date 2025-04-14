import PrimitiveType from "#PrimitiveType";

export default class BigIntType extends PrimitiveType<bigint, "BigIntType"> {
  constructor() {
    super("bigint");
  }
}
