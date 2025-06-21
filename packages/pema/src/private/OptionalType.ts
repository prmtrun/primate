import type Infer from "#Infer";
import type Validated from "#Validated";
import VirtualType from "#VirtualType";

export default class OptionalType<S extends Validated<unknown>>
  extends VirtualType<S | undefined, Infer<S> | undefined, "OptionalType"> {
  #schema: S;

  constructor(s: S) {
    super();
    this.#schema = s;
  }

  get name() {
    return "optional";
  }

  get schema() {
    return this.#schema;
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
