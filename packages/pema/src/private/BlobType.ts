import InstanceType from "#InstanceType";

export default class BlobType extends InstanceType<Blob, "BlobType"> {
  constructor() {
    super("blob", Blob);
  }
}
