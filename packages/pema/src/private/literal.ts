import LiteralType from "#LiteralType";

type Literal = string;

export default <T extends Literal>(t: T) => new LiteralType(t);
