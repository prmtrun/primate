import warn from "#log/warn";
import name from "#db/name";

export default warn(name)(import.meta.url, {
  message: "no document found with primary key {0}={1}",
  fix: "check first for existence with {2} or use {3}",
});
