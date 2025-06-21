import BuiltinType from "#BuiltinType";
import type Storeable from "#Storeable";

export default class URLType
  extends BuiltinType<URL, "URLType">
  implements Storeable<"string"> {

  constructor() {
    super("url", URL);
  }

  get datatype() {
    return "string" as const;
  }

  normalize(value: URL) {
    return value.toString();
  }
}
