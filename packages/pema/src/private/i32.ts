import IntType from "#IntType";
import range from "#validator/range";

const from = -(2 ** 31);
const to = 2 ** 31 - 1;

export default new IntType("i32", [range(from, to)]);
