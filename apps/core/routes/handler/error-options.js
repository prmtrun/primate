import error from "primate/handler/error";

export default {
  get() {
    return error({ body: "JavaScript error" });
  },
};
