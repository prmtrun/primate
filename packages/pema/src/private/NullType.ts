import expected from "#expected";
import type Infer from "#Infer";
import PrimitiveType from "#PrimitiveType";

const error_message = (name: string, x: unknown, key?: string) => {
  const base = expected(name, x);
  return key === undefined
    ? base
    : `${key}: ${base}`;
};

export default class NullType extends PrimitiveType<null, "NullType"> {
  constructor() {
    super("null");
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (x !== null) {
      throw new Error(error_message(this.name, x, key));
    }

    return x as never;
  }
}
