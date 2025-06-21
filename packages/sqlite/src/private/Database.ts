import Database from "@primate/core/db/Database";
import type Store from "@primate/core/db/Store";
import type Client from "#Client";
import type EO from "@rcompat/type/EO";
import runtime from "@rcompat/runtime";
import maybe from "@rcompat/assert/maybe";
import entries from "@rcompat/record/entries";

type CreateOptions = {
  limit?: number;
};
type Criteria = EO;
type Projection = EO[];
type ReadOptions = {
  sort?: "asc" | "desc";
  count?: boolean;
  limit?: number;
};

const is_bun = (runtime as "node" | "deno" | "bun") === "bun";

const make_sort = ({ sort = {} } = {}) => {
  maybe(sort).object();

  const _entries = Object.entries(sort)
    .map(([field, direction]) => `${field} ${direction}`);

  return _entries.length === 0 ? "" : `order by ${_entries.join(",")}`;
};

const predicate = (criteria: EO) => {
  const keys = Object.keys(criteria);
  if (keys.length === 0) {
    return { where: "", bindings: {} };
  }

  const where = `where ${keys.map(key => `"${key}"=$${key}`).join(" and ")}`;

  return { where, bindings: criteria };
};

export default class SqliteDatabase extends Database {
  #client: Client;
  #connection: any;

  constructor(client: Client) {
    super();

    this.#client = client;
  }

  async connection() {
    if (this.#connection === undefined) {
      this.#connection = await this.#client.acquire();
    }
    return this.#connection;
  }

  async create(_store: Store,
    _documents: EO[],
    _options?: CreateOptions) {
    return [];
  }

  async read(store: Store,
    criteria: Criteria,
    projection: Projection = [],
    options?: ReadOptions) {

    const sorting = make_sort(options ?? {});
    const { where, bindings } = predicate(criteria);
    const select = projection.length === 0 ? "*" : projection.join(", ");
    const query = `select ${select} from ${store.name} ${where} ${sorting};`;
    const statement = (await this.connection()).prepare(query);
    if (!is_bun) {
      statement.safeIntegers(true);
    }
    const results: Record<string, unknown>[] = statement.all(bindings);
    return results.map(result =>
      entries(result).filter(([, value]) => value !== null).get());
  }

  async update(_store: Store, _criteria: Criteria, _set: Document) {
    return 0;
  }

  async delete(_store: Store, _criteria: Criteria) {

  }
}
