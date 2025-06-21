import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";

export default class BooleanType
  extends PrimitiveType<boolean, "BooleanType">
  implements Storeable<"boolean"> {

  constructor() {
    super("boolean");
  }

  get datatype() {
    return "boolean" as const;
  }

  normalize(value: boolean) {
    return value;
  }
}
