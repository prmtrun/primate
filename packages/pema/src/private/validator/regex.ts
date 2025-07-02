import type Validator from "#Validator";

type ErrorFunction = (x: string) => string;

export default (regex: RegExp, error?: ErrorFunction): Validator<string> =>
  (x: string) => {
    if (!regex.test(x)) {
      throw new Error((error ?? (y => `"${y} is not a valid ${regex}`))(x));
    }
  };
