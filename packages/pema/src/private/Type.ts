import OptionalType from "#OptionalType";
import Validated from "#Validated";
import type Printable from "@rcompat/type/Printable";

export default abstract class Type<Type, Name extends string>
  extends Validated<Type>
  implements Printable {

  optional() {
    return new OptionalType(this);
  }

  get Name(): Name {
    return undefined as unknown as Name;
  }
}
