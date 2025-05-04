import type Printable from "@rcompat/type/Printable";
import Validated from "#Validated";

export default abstract class Type<Type, Name extends string>
  extends Validated<Type>
  implements Printable {

  get Name(): Name {
    return undefined as unknown as Name;
  }
}
