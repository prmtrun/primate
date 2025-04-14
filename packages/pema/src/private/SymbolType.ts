import PrimitiveType from "#PrimitiveType";

export default class SymbolType extends PrimitiveType<symbol, "SymbolType"> {
  constructor() {
    super("symbol");
  }
}
