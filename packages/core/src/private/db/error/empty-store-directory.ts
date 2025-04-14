import warn from "#log/warn";
import name from "#db/name";

export default warn(name)(import.meta.url, {
  message: "empty store directory",
  fix: "populate {0} with stores",
});
