import Query from "#db/Query";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import type EO from "@rcompat/type/EO";
import schema from "pema";
import type Schema from "pema/Schema";

type SchemaType<T extends Schema> = ReturnType<typeof schema<T>>;

type Primary = string;
type Count<T extends number = number> =
  `${T}` extends `-${infer _}` | `${infer _}.${infer _}`
    ? never
    : T;

type Document<T extends Schema> = SchemaType<T>["infer"];
type Criteria<T extends Schema> = X<Partial<Document<T>>>;

type PartialNull<T extends object> = {
  [K in keyof T]?: T[K] | null;
};

type Delta<T extends Schema> = X<PartialNull<Document<T>>>;
/*{
  [K in keyof T]?: Document<T[K]> | null;
};*/

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

type RelationOneType = EO;
type RelationManyType = EO;

type Store<T extends Schema> = {
  //get schema(): T;
//  one(): RelationOneType;
 // many(): RelationManyType;
  get(id: Primary): Promise<Document<T>>;
  find(criteria: Criteria<T>): Promise<Filter<Document<T>, undefined>[]>;
  find<F extends Fields<Document<T>>>(
    criteria: Criteria<T>,
    fields: F
  ): Promise<Filter<Document<T>, F>[]>;
  count(criteria?: Criteria<T>): Promise<Count>;
  exists(criteria: Criteria<T>): Promise<boolean>;
  insert(document: Document<T>): Promise<Document<T>>;
  update(criteria: Criteria<T>, set: Delta<T>): Promise<Document<T>>;
  //save(document: Document<T>): Promise<Document<T>>;
  delete(criteria: Criteria<T>): Promise<void>;
  query(): Query<T>;
};

export default <T extends Schema>(spec: T): Store<T> => {
  const o = schema(spec);

  return {
  /*  one() {
      return undefined as any;
    },
    many() {
      return undefined as any;
    },*/
 //   get schema() {
//      return o.schema;
  //  },
    async get(primary) {
      is(primary).string();

      return o.validate({});
    },
    async find(criteria: Criteria<T>, fields?: Fields<Document<T>>) {
      is(criteria).object();
      maybe(fields).object();

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

      return o.validate(document);
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
      return new Query(spec);
    },
  };
};
