import PrimitiveType from "#PrimitiveType";

export default class UndefinedType extends PrimitiveType<undefined, "UndefinedType"> {
  constructor() {
    super("undefined");
  }
}
