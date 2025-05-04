import PrimitiveType from "#PrimitiveType";

type Name = "UndefinedType";

export default class UndefinedType extends PrimitiveType<undefined, Name> {
  constructor() {
    super("undefined");
  }
}
