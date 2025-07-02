import type Validator from "#Validator";

export default (prefix: string): Validator<string> => (x: string) => {
  if (!x.startsWith(prefix)) {
    throw new Error(`"${x}" does not start with "${prefix}"`);
  }
};
