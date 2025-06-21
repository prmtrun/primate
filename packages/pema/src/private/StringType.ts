import PrimitiveType from "#PrimitiveType";
import type Storeable from "#Storeable";
import type Validator from "#Validator";

const starts_with_validator = (prefix: string): Validator<string> =>
  (x: string) => {
    if (!x.startsWith(prefix)) {
      throw new Error(`"${x}" does not start with "${prefix}"`);
    }
  };

const ends_with_validator = (suffix: string): Validator<string> =>
  (x: string) => {
    if (!x.endsWith(suffix)) {
      throw new Error(`"${x}" does not end with "${suffix}"`);
    }
  };

export default class StringType
  extends PrimitiveType<string, "StringType">
  implements Storeable<"string"> {

  constructor(validators?: Validator<string>[]) {
    super("string", validators);
  }

  get datatype() {
    return "string" as const;
  }

  normalize(value: string) {
    return value;
  }

  startsWith(prefix: string) {
    return new StringType([...this.validators, starts_with_validator(prefix)]);
  }

  endsWith(suffix: string) {
    return new StringType([...this.validators, ends_with_validator(suffix)]);
  }
}
