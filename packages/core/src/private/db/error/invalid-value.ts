import name from "#db/name";
import error from "#log/error";

export default error(name)(import.meta.url, {
  message: "value {0} could not be unpacked to {1}",
  fix: "change type for {2} or correct data in databases",
});
