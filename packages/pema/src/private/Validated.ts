import ValidatedKey from "#ValidatedKey";
import type Printable from "@rcompat/type/Printable";

export default abstract class Type<
  StaticType, /* type to resolve to */
  Name extends string = string/* name of class */
> implements Printable {
  get Name(): Name {
    return undefined as unknown as Name;
  };

  get [ValidatedKey](): "ValidatedKey" {
    return "ValidatedKey";
  }

  get infer() {
    return undefined as StaticType;
  }

  abstract get name(): string;

  abstract validate(x: unknown, key?: string): StaticType;
}
