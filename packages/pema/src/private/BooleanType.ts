import PrimitiveType from "#PrimitiveType";

export default class BooleanType extends PrimitiveType<boolean, "BooleanType"> {
  constructor() {
    super("boolean");
  }
}
