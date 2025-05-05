import name from "#db/name";
import warn from "#log/warn";

export default warn(name)(import.meta.url, {
  message: "store directory does not exist",
  fix: "create {0} and populate it",
});
