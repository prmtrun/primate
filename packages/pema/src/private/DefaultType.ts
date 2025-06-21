import GenericType from "#GenericType";
import type Infer from "#Infer";
import type Validated from "#Validated";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

const is_default_function = (x: unknown): x is UnknownFunction => {
  return typeof x === "function";
};

export default class DefaultType<
  S extends Validated<unknown>,
  D extends Infer<S>,
> extends GenericType<S, Infer<S>, "DefaultType"> {
  #schema: S;
  #default: D | (() => D);

  constructor(s: S, d: D | (() => D)) {
    super();
    this.#schema = s;
    this.#default = d;
  }

  get datatype() {
    if ("datatype" in this.#schema) {
      return this.#schema.datatype;
    }
    throw new Error("cannot be used in a store");
  }

  get name() {
    return "default";
  }

  validate(x: unknown, key?: string): Infer<this> {
    // default fallback
    if (x === undefined) {
      if (is_default_function(this.#default)) {
        return this.#default() as Infer<this>;
      }
      return this.#default as Infer<this>;
    }

    return this.#schema.validate(x, key) as Infer<this>;
  }
}
