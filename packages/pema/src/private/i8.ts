import IntType from "#IntType";
import range from "#validator/range";

const from: number = -(2 ** 7);
const to: number = 2 ** 7 - 1;

export default new IntType("i8", [range(from, to)]);
