import type Store from "#db/Store";
import type EO from "@rcompat/type/EO";
import type MaybePromise from "@rcompat/type/MaybePromise";
import type DataType from "pema/DataType";

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
type Description = Record<string, keyof DataType>;

export default abstract class Database {
  abstract schema: {
    create(name: string, description: Description): MaybePromise<void>;
    delete(name: string ): MaybePromise<void>;
  };

  abstract create(
    store: Store,
    documents: Document[],
    options?: CreateOptions,
  ): MaybePromise<Document[]>;

  abstract read(
    store: Store,
    criteria: Criteria,
    projection?: Projection,
    options?: ReadOptions,
  ): MaybePromise<Document[]>;

  abstract update(
    store: Store,
    criteria: Criteria,
    set: Document
  ): MaybePromise<number>;

  abstract delete(
    store: Store,
    criteria: Criteria,
  ): MaybePromise<void>;
};
