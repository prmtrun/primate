import BigIntType from "#BigIntType";
import range from "#validator/range";

const from = -(2n ** 127n);
const to = 2n ** 127n - 1n;

export default new BigIntType("i128", [range(from, to)]);
