import OptionalType from "#OptionalType";
import { type Schema } from "#schema";

export default <const T extends Schema>(type: T) => new OptionalType(type);
