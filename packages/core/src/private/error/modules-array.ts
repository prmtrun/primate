import error from "#log/error";
import name from "#name";

export default error(name)(import.meta.url, {
  message: "the {0} config property must be an array",
  fix: "change {0} to an array in the config or remove this property",
});
