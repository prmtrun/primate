import type Infer from "#Infer";
import Validated from "#Validated";
import expected from "#expected";
import is_validated_type from "#is_validated_type";
import schema, { type InferSchema, type Schema } from "#schema";
import PrintableGeneric from "@rcompat/type/PrintableGeneric";

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
}

const error = (message: string, key?: string) => {
  return key === undefined
    ? message
    : `${key}: ${message}`;
}

export default class TupleType<Members extends Schema[]>
  extends Validated<InferTuple<Members>, "TupleType">
  implements PrintableGeneric<Members> {
  #members: Members;

  get Type(): Members {
    return undefined as unknown as Members;
  }

  constructor(members: Members) {
    super();
    this.#members = members;
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
