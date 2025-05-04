import type { ServeAppHook } from "@primate/core/hook";
import handler from "./handler.js";

export default (extension: string): ServeAppHook => (app, next) => {
  app.register(extension, handler);

  return next(app);
};
