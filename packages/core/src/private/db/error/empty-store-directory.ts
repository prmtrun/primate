import name from "#db/name";
import warn from "#log/warn";

export default warn(name)(import.meta.url, {
  message: "empty store directory",
  fix: "populate {0} with stores",
});
