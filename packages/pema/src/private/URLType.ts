import InstanceType from "#InstanceType";

export default class URLType extends InstanceType<URL, "URLType"> {
  constructor() {
    super("url", URL);
  }
}
