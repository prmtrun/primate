import type PartialDictionary from "@rcompat/type/PartialDictionary";
import type Facade from "#db/Facade";
import type Store from "#db/Store";

type Config = {
  default: Facade;
} & PartialDictionary<Facade>;

export default (config: Config) => {
  const drivers = config;

  return {
    wrap(name: string, store: Store) {
      const driver = store.driver;

      if (drivers[driver] === undefined) {
        throw new Error(`store ${name} has invalid driver (${driver})`);
      }

      //store.facade = drivers[driver];

      return store;
    },
  };
};
