import type Database from "#db/Database";
import type Store from "#db/Store";
import derive from "#db/symbol/derive";
import type PartialDictionary from "@rcompat/type/PartialDictionary";

type Config = {
  default: Database;
} & PartialDictionary<Database>;

export default (config: Config) => {
  const drivers = config;

  return {
    wrap(name: string, store: Store) {
      return store[derive](name, drivers.default);
    },
  };
};
