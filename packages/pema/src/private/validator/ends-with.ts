import type Validator from "#Validator";

export default (suffix: string): Validator<string> => (x: string) => {
  if (!x.endsWith(suffix)) {
    throw new Error(`"${x}" does not end with "${suffix}"`);
  }
};
