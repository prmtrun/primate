import string from "pema/string";
import store from "primate/store";

export const getMe = () => undefined;

export default store({
  name: string,
  lastname: string.optional(),
});
