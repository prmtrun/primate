import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";
import type Validator from "#Validator";
import email from "#validator/email";
import ends_with from "#validator/ends-with";
import isotime from "#validator/isotime";
import regex from "#validator/regex";
import starts_with from "#validator/starts-with";
import uuid from "#validator/uuid";

type Datatype = "string" | "isotime";

export default class StringType<T extends Datatype = "string">
  extends PrimitiveType<string, "StringType">
  implements Storeable<T> {
  #datatype: T;

  constructor(validators?: Validator<string>[], datatype?: T) {
    super("string", validators);

    this.#datatype = datatype ?? ("string" as T);
  }

  get datatype() {
    return this.#datatype;
  }

  normalize(value: string) {
    return value;
  }

  isotime() {
    return new StringType([...this.validators, isotime], "isotime");
  }

  regex(pattern: RegExp) {
    return new StringType([...this.validators, regex(pattern)]);
  }

  email() {
    return new StringType([...this.validators, email]);
  }

  uuid() {
    return new StringType([...this.validators, uuid]);
  }

  startsWith(prefix: string) {
    return new StringType([...this.validators, starts_with(prefix)]);
  }

  endsWith(suffix: string) {
    return new StringType([...this.validators, ends_with(suffix)]);
  }
}
