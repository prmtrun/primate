import type Database from "#db/Database";
import type EO from "@rcompat/type/EO";
import type Store from "#db/Store";

type Projection = EO[] | null;
type Criteria = EO;
type ReadOptions = {
  count?: boolean;
  limit?: number;
};
type CreateOptions = {
  limit?: number;
};

export default class InMemoryDatabase implements Database {
  async create(
    _store: Store,
    _documents: Document[],
    _options?: CreateOptions,
  ): Promise<Document[]> {
    return [];
  }

  async read(
    _store: Store,
    _criteria: Criteria,
    _projection?: Projection,
    _options?: ReadOptions,
  ): Promise<Document[]> {
    return [];
  }

  async update(
    _store: Store,
    _criteria: Criteria,
    _set: Document,
  ) {
    return 1;
  }

  async delete(
    _store: Store,
    _criteria: Criteria,
  ) {
  }
}
