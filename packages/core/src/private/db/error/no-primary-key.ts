import name from "#db/name";
import error from "#log/error";

export default error(name)(import.meta.url, {
  message: "primary key {0} does not exist in store {1}",
  fix: "add an {0} field or set {2} to the store",
});
