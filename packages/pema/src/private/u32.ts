import UintType from "#UintType";
import range from "#validator/range";

const from: number = 0;
const to: number = 2 ** 32 - 1;

export default new UintType("u32", [range(from, to)]);
