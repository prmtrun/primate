export default (type: string, x: unknown) =>
  `expected ${type}, got \`${x?.toString() ?? x}\` (${(typeof x)})`;
