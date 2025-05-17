import expected from "#expected";
import type Infer from "#Infer";
import Type from "#Type";
import type Validator from "#Validator";

const error_message = (name: string, x: unknown, key?: string) => {
  const base = expected(name, x);
  return key === undefined
    ? base
    : `${key}: ${base}`;
};

export default class PrimitiveType<StaticType, Name extends string>
  extends Type<StaticType, Name> {
  #name: string;
  #validators: Validator<StaticType>[];

  constructor(name: string, validators: Validator<StaticType>[] = []) {
    super();
    this.#name = name;
    this.#validators = validators;
  }

  get validators() {
    return this.#validators;
  }

  get name() {
    return this.#name;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (typeof x !== this.name) {
      throw new Error(error_message(this.name, x, key));
    }

    this.#validators.forEach(validator => validator(x as never));

    return x as never;
  }
}
