import name from "#db/name";
import error from "#log/error";

export default error(name)(import.meta.url, {
  message: "field {0} in store {1} has invalid type",
  fix: "use a valid type",
});
