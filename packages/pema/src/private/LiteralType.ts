import GenericType from "#GenericType";
import type Infer from "#Infer";
import expected from "#expected";

const error = (message: string, key?: string) => {
  return key === undefined
    ? message
    : `${key}: ${message}`;
};

type Literal = string;
type InferLiteral<T extends Literal> = T;

export default class LiteralType<T extends Literal> extends
  GenericType<T, InferLiteral<T>, "LiteralType"> {
  #literal: T;

  constructor(literal: T) {
    super();
    this.#literal = literal;
  }

  get name() {
    return "literal";
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (x !== this.#literal) {
      throw new Error(error(expected(`literal '${this.#literal}'`, x), key));
    }
    return x as never;
  }
}
