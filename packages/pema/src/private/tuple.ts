  import TupleType from "#TupleType";
import { type Schema } from "#schema";

export default <const T extends Schema[]>(...types: T) => new TupleType(types);
