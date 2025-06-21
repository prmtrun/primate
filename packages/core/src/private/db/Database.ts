import type Store from "#db/Store";
import type EO from "@rcompat/type/EO";

type Criteria = EO;
type Projection = EO[] | null;
type ReadOptions = {
  count?: boolean;
  limit?: number;
};

type CreateOptions = {
  limit?: number;
};
type Document = EO;

type SchemaFacade = {
  create(schema: string, description: EO): void;
  drop(schema: string): void;
};

export default abstract class Database {
//  abstract schema: SchemaFacade;
  abstract create(
    store: Store,
    documents: Document[],
    options?: CreateOptions,
  ): Promise<Document[]>;

  abstract read(
    store: Store,
    criteria: Criteria,
    projection?: Projection,
    options?: ReadOptions,
  ): Promise<Document[]>;

  abstract update(
    store: Store,
    criteria: Criteria,
    set: Document): Promise<number>;

  abstract delete(
    store: Store,
    criteria: Criteria,
  ): Promise<void>;
};
