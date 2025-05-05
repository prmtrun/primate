import GenericType from "#GenericType";
import type Infer from "#Infer";
import is_validated_type from "#is_validated_type";
import schema, { type InferSchema, type Schema } from "#schema";

export default class OptionalType<S extends Schema> extends
  GenericType<S, InferSchema<S>, "OptionalType"> {
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
      return x as Infer<this>;
    }

    const validator = is_validated_type(s) ? s : schema(s);
    return validator.validate(x, key) as Infer<this>;
  }
}
