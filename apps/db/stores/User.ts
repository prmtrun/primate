import string from "pema/string";
import store from "primate/store";

export const getMe = () => undefined;

const t = store({
  name: string,
  lastname: string.optional(),
});

export default t;
