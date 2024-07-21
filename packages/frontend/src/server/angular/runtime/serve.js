import serve from "@primate/frontend/base/serve";
import render from "./render.js";
import set_mode from "./set-mode.js";

export default extension => {
  // todo: base on app mode
  set_mode("production");

  return serve({ render })(extension);
};
