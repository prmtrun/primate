import Facade from "#Facade";
import Client from "#Client";
import ident from "@primate/store/core/ident";
import wrap from "@primate/store/core/wrap";
import numeric from "@rcompat/invariant/numeric";
import type Serializable from "@rcompat/record/Serializable";

export default (database: string) => async () => {
  const client = new Client(database);

  const types = {
    primary: {
      validate(value: number | string) {
        if (typeof value === "number" || numeric(value)) {
          return Number(value);
        }
        throw new Error(`\`${value}\` is not a valid primary key value`);
      },
      ...ident,
      out(value: bigint) {
        // bigint
        return Number(value);
      },
    },
    object: {
      in(value: Serializable) {
        return JSON.stringify(value);
      },
      out(value: string) {
        return JSON.parse(value);
      },
    },
    number: {
      in(value: number) {
        return value;
      },
      out(value: number) {
        return Number(value);
      },
    },
    // in: driver accepts both number and bigint
    // out: find/get currently set statement.safeIntegers(true);
    bigint: ident,
    boolean: {
      in(value: boolean) {
        return value === true ? 1 : 0;
      },
      out(value: 0 | 1) {
        // out: find/get currently set statement.safeIntegers(true);
        return Number(value) === 1;
      },
    },
    date: {
      in(value: Date) {
        return value.toJSON();
      },
      out(value: string) {
        return new Date(value);
      },
    },
    string: ident,
  };

  return {
    name: "@primate/sqlite",
    types,
    async transact(stores) {
      return async (others, next) => {
        const connection = await client.acquire();
        const facade = new Facade(connection);
        try {
          connection.prepare("begin transaction").run();
          const response = await next([...others, ...stores.map(([_, store]) =>
            [_, wrap(store, facade, types)]),
          ]);
          connection.prepare("commit transaction").run();
          return response;
        } catch (error) {
          connection.prepare("rollback transaction").run();
          // bubble up
          throw error;
        } finally {
          // noop, no end transaction
          client.release(connection);
        }
      };
    },
  };
};
