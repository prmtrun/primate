import GenericType from "#GenericType";
import type Infer from "#Infer";
import type Validated from "#Validated";

export default class OptionalType<S extends Validated<unknown>> extends
  GenericType<S | undefined, Infer<S> | undefined, "OptionalType"> {
  #schema: S;

  constructor(s: S) {
    super();
    this.#schema = s;
  }

  default(value: Infer<this>) {
    return this;
  }

  get name() {
    return "optional";
  }

  validate(x: unknown, key?: string): Infer<this> {
    const s = this.#schema;

    // optional
    if (x === undefined) {
      return undefined as Infer<this>;
    }

    return s.validate(x, key) as Infer<this>;
  }
}
