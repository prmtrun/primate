import BuiltinType from "#BuiltinType";

export default class BlobType extends BuiltinType<Blob, "BlobType"> {
  constructor() {
    super("blob", Blob);
  }
}
