import type Query from "#db/Query";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import object from "pema/object";
import type ObjectProperties from "pema/ObjectProperties";

type ObjectType<T extends ObjectProperties> = ReturnType<typeof object<T>>;
/*type PromiseRecord<T> = {
  [K in keyof T]:
    T[K] extends (...args: any[]) => any
      ? (...params: Parameters<(T[K])>) => Promise<ReturnType<T[K]>>
      : never;
};*/

type Primary = string;
type Count<T extends number = number> =
  `${T}` extends `-${infer _}` | `${infer _}.${infer _}`
    ? never
    : T;

type Document<T extends ObjectProperties> = ObjectType<T>["infer"];
type Criteria<T extends ObjectProperties> = X<Partial<Document<T>>>;

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

type Store<T extends ObjectProperties> = {
  get: (id: Primary) => Promise<Document<T>>;
  find(criteria: Criteria<T>):
    Promise<Filter<Document<T>, undefined>[]>;
  find<F extends Fields<Document<T>>>(
    criteria: Criteria<T>,
    fields: F
  ): Promise<Filter<Document<T>, F>[]>;
  count: (criteria?: Criteria<T>) => Promise<Count>;
  exists: (criteria: Criteria<T>) => Promise<boolean>;
  insert: (document: Document<T>) => Promise<Document<T>>;
  update: (criteria: Criteria<T>, document: Document<T>) => Promise<Document<T>>;
  save: (document: Document<T>) => Promise<Document<T>>;
  delete: (criteria: Criteria<T>) => Promise<void>;
  query: () => Query<T>;
};

export default <T extends ObjectProperties>(schema: T): Store<T> => {
  const o = object(schema);

  return {
    async get(primary) {
      is(primary).string();

      return o.validate({});
    },
    async find(query: Query<T>, fields?: Fields<Document<T>>) {
      is(query).object();
      maybe(fields).object()

      return [o.validate({})];
    },
    async count(query) {
      maybe(query).object();

      return 0;
    },
    async exists(query) {
      maybe(query).object();

      return false;
    },
    async insert(document) {
      is(document).object();

      return o.validate({});
    },
    async update(query, document) {
      is(query).object();
      is(document).object();

      return o.validate({});
    },
    async save(document) {
      is(document).object();

      return o.validate({});
    },
    async delete(query) {
      is(query).object();
    },
    query() {
      return new QueryBuilder(schema);
    },
  };
};
