import type Document from "#db/Document";
import Query from "#db/Query";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import type InferStore from "pema/InferStore";
import type StoreSchema from "pema/StoreSchema";
import StoreType from "pema/StoreType";
import type BaseStore from "#db/BaseStore";

type X<T> = {
  [K in keyof T]: T[K]
} & {};
type Primary = string;
type Criteria<T extends StoreSchema> = X<Partial<InferStore<T>>>;

type Fields<T> = {
  [K in keyof T]?: true;
};

type Filter<A, B = undefined> = B extends undefined ? A : {
  [K in keyof A as K extends keyof B
    ? B[K] extends true ? K : never : never
  ]: A[K];
};

type Config = {
  driver: "default" | (string & {});
};

export default class Store<S extends StoreSchema = StoreSchema> {
  #schema: S;
  #type: StoreType<S>;
  #config: Config;

  constructor(schema: S, config?: Config) {
    this.#schema = schema;
    this.#type = new StoreType(schema);
    this.#config = config ?? { driver: "default" };
  }

  get driver() {
    return this.#config.driver;
  }

  // allow importers to expose this class as a function
  static new(schema: StoreSchema, config?: Config) {
    return new Store(schema, config);
  }

  /**
   * *Check whether a document with the given key exists in the database*
   *
   * @param key the document's primary key
   *
   * @returns **true** if a document with the given key exists
   */
  async exists(key: Primary): Promise<boolean> {
      is(key).string();

      return false; //this.#facade.exists();
  };

  /**
   * *Get a single document with the given key from the database*
   *
   * @param key the document's primary key
   *
   * @returns the document for the given key
   *
   * @throws if a document with given key does not exist
   */
  async get(key: Primary): Promise<Document<S>> {
    is(key).string();

    return this.#type.validate({});
  }

  /**
   * *Insert a document to the database*
   *
   * If the document has
   * - no primary key, generate one and **insert**
   * - a primary key not in the database, **insert** as is
   * - a primary key already in the database, **show error**
   *
   * @param document the document to be set
   *
   * @returns the set document with primary key
   */
  async insert(document: Document<S>): Promise<Document<S>> {
    is(document).object();

    return this.#type.validate(document);
  }

  /**
   * *Update a document in the database*
   */
  async update(_key: Primary, change: Document<S>): Promise<Document<S>> {
    is(change).object();

    return this.#type.validate(change);
  }

  /**
   * *Delete a document from the database
   *
   * @param id the document's primary key
   * @throws if such a document does not exist
   */
  async delete(key: Primary): Promise<void> {
    is(key).string();
  }

  /**
   * *Find matching documents*
   *
   * @param criteria the filtering criteria
   * @param fields [{}] the fields to be returned
   *
   * @returns found documents
   */
  find(criteria: Criteria<S>): Promise<Filter<Document<S>>[]>;
  find<F extends Fields<Document<S>>>(
    criteria: Criteria<S>,
    fields: F
  ): Promise<Filter<Document<S>, F>[]>;
  async find(criteria: Criteria<S>, fields?: Fields<Document<S>>) {
    is(criteria).object();
    maybe(fields).object();

    return [this.#type.validate({})];
  };

  /**
   * *Create a custom query*
   *
   * @returns a buildable query
  */
  query(): Query<S> {
    return new Query(this.#schema);
  }
};
