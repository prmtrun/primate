import type Infer from "#Infer";
import Type from "#Type";
import expected from "#expected";

const error_message = (name: string, x: unknown, key?: string) => {
  const base = expected(name, x);
  return key === undefined
    ? base
    : `${key}: ${base}`;
};

export default class PrimitiveType<StaticType, Name extends string>
  extends Type<StaticType, Name> {
  #name: string;

  constructor(name: string) {
    super();
    this.#name = name;
  }

  default(value: StaticType) {
    return this;
  }

  get name() {
    return this.#name;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (typeof x !== this.name) {
      throw new Error(error_message(this.name, x, key));
    }

    return x as never;
  }
}
