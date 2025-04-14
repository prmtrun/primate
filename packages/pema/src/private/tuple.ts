import TupleType from "#TupleType";
import { type Schema } from "#schema";

export default <const T extends Schema[]>(...tuple: T) => new TupleType(tuple);
