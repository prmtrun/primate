import FileRef from "@rcompat/fs/FileRef";
import root from "@rcompat/package/root";

const load = async () => {
  try {
    return await root();
  } catch {
    return FileRef.resolve();
  }
};

// serve from build directory
export default async (from = "build") =>
  (await load()).join(`./${from}/serve.js`).import();
