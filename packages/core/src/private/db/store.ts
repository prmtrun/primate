import Query from "#db/Query";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import schema from "pema";
import type Schema from "pema/Schema";

type SchemaType<T extends Schema> = ReturnType<typeof schema<T>>;

type Document<T extends Schema> = SchemaType<T>["infer"];
type Criteria<T extends Schema> = X<Partial<Document<T>>>;

type Fields<T> = {
  [K in keyof T]?: true;
};

type Filter<A, B = undefined> = B extends undefined ? A : {
  [K in keyof A as K extends keyof B
    ? B[K] extends true ? K : never : never
  ]: A[K];
};

type X<T> = {
  [K in keyof T]: T[K]
} & {};

type Primary = string;

type Store<T extends Schema> = {
  /**
   * *Check whether the database **has** a document with given key*
   *
   * @param key the document's primary key
   *
   * @returns **true** if a document with the given key exists
   */
  has(key: Primary): Promise<boolean>;
  /**
   * ***Get** a document with the given key from the database*
   *
   * @param key the document's primary key
   *
   * @returns the document for the given key
   *
   * @throws if a document with given key does not exist
   */
  get(key: Primary): Promise<Document<T>>;
  /**
   * ***Set** a document to the database*
   *
   * If the document has
   * - no primary key, generate one and **insert**
   * - a primary key not in the database, **insert** as is
   * - a primary key already in the database, **update**
   *
   * @param document the document to be set
   *
   * @returns the set document with primary key
   */
  set(document: Document<T>): Promise<Document<T>>;
  /**
   * ***Unset** a document in the database*
   *
   * @param id the document's primary key
   * @throws if such a document does not exist
   */
  unset(key: Primary): Promise<void>;
  /**
   * ***Find** matching documents*
   *
   * @param criteria the filtering criteria
   * @param fields [{}] the fields to be returned
   *
   * @returns found documents
   */
  find(criteria: Criteria<T>): Promise<Filter<Document<T>>[]>;
  find<F extends Fields<Document<T>>>(
    criteria: Criteria<T>,
    fields: F
  ): Promise<Filter<Document<T>, F>[]>;
  /**
   * *Create a custom **query***
   *
   * @returns a buildable query
  */
  query(): Query<T>;
};

export default <T extends Schema>(spec: T): Store<T> => {
  const o = schema(spec);

  return {
    async has(key) {
      is(key).string();

      return false;
    },
    async get(key) {
      is(key).string();

      return o.validate({});
    },
    async set(document) {
      is(document).object();

      return o.validate(document);
    },
    async unset(key) {
      is(key).string();
    },
    async find(criteria: Criteria<T>, fields?: Fields<Document<T>>) {
      is(criteria).object();
      maybe(fields).object();

      return [o.validate({})];
    },
    query() {
      return new Query(spec);
    },
  };
};
