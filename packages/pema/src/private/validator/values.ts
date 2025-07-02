import type Validator from "#Validator";

export default <T>(values: Record<string, T>): Validator<T> => (x: T) => {
  if (!Object.values(values).includes(x)) {
    throw new Error(`"${x}" not in given list of values`);
  }
};
