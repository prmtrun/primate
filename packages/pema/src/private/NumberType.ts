import PrimitiveType from "#PrimitiveType";

export default class NumberType extends PrimitiveType<number, "NumberType"> {
  constructor() {
    super("number");
  }
}
