import warn from "#log/warn";
import name from "#db/name";

export default warn(name)(import.meta.url, {
  message: "document validation failed for {0}, errors:\n{1}",
  fix: "check and fix errors",
});
