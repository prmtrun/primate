import ArrayType from "#ArrayType";
import type Validated from "#Validated";

export default <const T extends Validated<unknown>>(t: T) => new ArrayType(t);
