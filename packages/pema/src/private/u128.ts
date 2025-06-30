import BigUintType from "#BigUintType";
import range from "#validator/range";

const from: bigint = 0n;
const to: bigint = 2n ** 128n - 1n;

export default new BigUintType("u128", [range(from, to)]);
