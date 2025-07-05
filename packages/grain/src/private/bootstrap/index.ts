
import instantiate from "@primate/core/wasm/instantiate";

const instantiated = await instantiate({
  wasmFile: "__FILE_NAME__",
  storesFolder: "__STORES_FOLDER__",
  imports: {}, // custom imports if necessary
});

const api = instantiated.api

export { api as default }
