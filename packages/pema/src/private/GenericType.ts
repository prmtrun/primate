import Validated from "#Validated";
import type PrintableGeneric from "@rcompat/type/PrintableGeneric";

export default abstract class GenericType<Type, Inferred, Name extends string>
  extends Validated<Inferred>
  implements PrintableGeneric<Type> {

  get Name(): Name {
    return undefined as unknown as Name;
  }

  get Type(): Type {
    return undefined as unknown as Type;
  }
}
