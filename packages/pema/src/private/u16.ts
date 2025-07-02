import UintType from "#UintType";
import range from "#validator/range";

const from: number = 0;
const to: number = 2 ** 16 - 1;

export default new UintType("u16", [range(from, to)]);
