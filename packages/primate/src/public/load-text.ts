import FileRef from "@rcompat/fs/FileRef";
import type Path from "@rcompat/fs/Path";

export default (path: Path, ...paths: Path[]) =>
  FileRef.join(path, ...paths).text();
