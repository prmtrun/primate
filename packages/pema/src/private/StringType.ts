import PrimitiveType from "#PrimitiveType";

export default class StringType extends PrimitiveType<string, "StringType"> {
  constructor() {
    super("string");
  }
}
