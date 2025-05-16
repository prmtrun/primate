export default (n: unknown): n is number | bigint => {
  const type = typeof n;
  return type === "number" && Number.isInteger(n) || type === "bigint";
};
