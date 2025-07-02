import IntType from "#IntType";
import range from "#validator/range";

const from = -(2 ** 15);
const to = 2 ** 15 - 1;

export default new IntType("i16", [range(from, to)]);
