import error from "#log/error";
import name from "#db/name";

export default error(name)(import.meta.url, {
  message: "could not find driver {0}",
  fix: "install driver by issuing {1}",
});
