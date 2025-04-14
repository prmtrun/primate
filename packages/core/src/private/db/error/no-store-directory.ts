import warn from "#log/warn";
import name from "#db/name";

export default warn(name)(import.meta.url, {
  message: "store directory does not exist",
  fix: "create {0} and populate it",
});
