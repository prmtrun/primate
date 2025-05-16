import BuiltinType from "#BuiltinType";

export default class FileType extends BuiltinType<File, "FileType"> {
  constructor() {
    super("file", File);
  }
}
