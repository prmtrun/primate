export default (n: number | bigint) => {
  if (!Number.isInteger(n)) {
    throw new Error(`${n} is not an integer`);
  };
};
