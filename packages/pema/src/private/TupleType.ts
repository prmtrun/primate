import GenericType from "#GenericType";
import type Infer from "#Infer";
import expected from "#expected";
import is_validated_type from "#is_validated_type";
import schema, { type InferSchema, type Schema } from "#schema";

export type InferTuple<T extends Schema[]> = {
    [K in keyof T]:
      T[K] extends Schema
      ? InferSchema<T[K]>
      : "t0"
};

const member_error = (i: unknown, key?: string) => {
  return key === undefined
    ? `[${i}]`
    : `${key}[${i}]`;
};

const error = (message: string, key?: string) => {
  return key === undefined
    ? message
    : `${key}: ${message}`;
};

export default class TupleType<T extends Schema[]> extends
  GenericType<T, InferTuple<T>, "TupleType"> {
  #members: T;

  constructor(members: T) {
    super();
    this.#members = members;
  }

  default(value: Infer<this>) {
    return this;
  }

  get name() {
    return "tuple";
  }

  validate(x: unknown, key?: string): Infer<this> {
    if (!(!!x && Array.isArray(x))) {
      throw new Error(error(expected("array", x), key));
    }

    this.#members.forEach((v, i) => {
      const validator = is_validated_type(v) ? v : schema(v);
      validator.validate(x[i], `${member_error(i, key)}` as string);
    });

    (x as unknown[]).forEach((v, i) => {
      const member = this.#members[i];
      const validator = is_validated_type(member) ? member : schema(member);
      validator.validate(v, `${member_error(i, key)}` as string);
    });

    return x as never;
  }
}
