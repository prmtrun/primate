import type Infer from "#Infer";
import Type from "#Type";
import type AbstractorController from "@rcompat/type/AbstractConstructor";

const error_message = (name: string, x: unknown, key?: string) => {
  const base = `expected ${name}, got \`${x}\` (${(typeof x)})`;
  return key === undefined
    ? base
    : `${key}: ${base}`;
};

export default class BuiltinType<StaticType, Name extends string>
  extends Type<StaticType, Name> {
  #name: string;
  #type: AbstractorController;

  constructor(name: string, type: AbstractorController) {
    super();
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!(x instanceof this.#type)) {
      throw new Error(error_message(this.#name, x, key));
    }

    return x as never;
  }
}
