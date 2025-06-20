import is from "@rcompat/assert/is";
import maybe from "@rcompat/assert/maybe";

export type ValidationFunction = (value: unknown, name: string) => unknown;

export type Validator = { validate: ValidationFunction };

// Todo: Refactor to remove type assertions
export default (type: Validator | ValidationFunction, value: unknown, name: string) => {
  maybe((type as Validator).validate).function();
  if ((type as Validator).validate) {
    return (type as Validator).validate(value, name);
  }
  is(type).function();
  return (type as ValidationFunction)(value, name);
};
