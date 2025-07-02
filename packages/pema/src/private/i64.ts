import BigIntType from "#BigIntType";
import range from "#validator/range";

const from = -(2n ** 63n);
const to = (2n ** 63n) - 1n;

export default new BigIntType("i64", [range(from, to)]);
