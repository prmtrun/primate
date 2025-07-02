import BigUintType from "#BigUintType";
import range from "#validator/range";

const from: bigint = 0n;
const to: bigint = 2n ** 64n - 1n;

export default new BigUintType("u64", [range(from, to)]);
