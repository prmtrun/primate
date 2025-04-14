import InstanceType from "#InstanceType";

export default class FileType extends InstanceType<File, "FileType"> {
  constructor() {
    super("file", File);
  }
}
