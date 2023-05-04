import {Path} from "runtime-compat/fs";
import json from "./json.js";
import base from "./base.test.js";

const path = new Path(import.meta.url).up(1).join("db.json");

export default base(() => json({path: `${path}`}), {
  after: async () => {
    if (await path.exists) {
      await path.file.remove();
    }
  },
});
