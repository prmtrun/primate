import type Schema from "#Schema";
import TupleType from "#TupleType";

export default <const T extends Schema[]>(...types: T) => new TupleType(types);
