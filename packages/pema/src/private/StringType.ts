import PrimitiveType from "#PrimitiveType";
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

export default class StringType extends PrimitiveType<string, "StringType"> {
  constructor(validators?: Validator<string>[]) {
    super("string", validators);
  }

  startsWith(prefix: string) {
    return new StringType([...this.validators, starts_with_validator(prefix)]);
  }

  endsWith(suffix: string) {
    return new StringType([...this.validators, ends_with_validator(suffix)]);
  }
}
