import BuiltinType from "#BuiltinType";

export default class URLType extends BuiltinType<URL, "URLType"> {
  constructor() {
    super("url", URL);
  }
}
