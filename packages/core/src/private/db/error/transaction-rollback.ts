import name from "#db/name";
import warn from "#log/warn";

export default warn(name)(import.meta.url, {
  message: "transaction {0} rolled back due to previous error",
  fix: "fix previous error: {1}",
});
