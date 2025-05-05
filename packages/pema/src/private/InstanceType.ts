import type Infer from "#Infer";
import Type from "#Type";
import type Instance from "@rcompat/type/Instance";

const error_message = (name: string, x: unknown, key?: string) => {
  const base = `expected ${name}, got \`${x}\` (${(typeof x)})`;
  return key === undefined
    ? base
    : `${key}: ${base}`;
};

export default class InstanceType<StaticType, Name extends string>
  extends Type<StaticType, Name> {
  #name: string;
  #instance: Instance;

  constructor(name: string, instance: Instance) {
    super();
    this.#name = name;
    this.#instance = instance;
  }

  default(value: StaticType) {
    return this;
  }

  get name() {
    return this.#name;
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!(x instanceof this.#instance)) {
      throw new Error(error_message(this.#name, x, key));
    }

    return x as never;
  }
}
