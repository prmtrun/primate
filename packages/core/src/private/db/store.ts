import Query from "#db/Query";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import type EO from "@rcompat/type/EO";
import schema from "pema";
import type Schema from "pema/Schema";
import type OptionalType from "pema/OptionalType";
import type NullType from "pema/NullType";
import type UnionType from "pema/UnionType";

type SchemaType<T extends Schema> = ReturnType<typeof schema<T>>;

type Primary = string;
type Count<T extends number = number> = `${T}` extends
  | `-${infer _}`
  | `${infer _}.${infer _}`
  ? never
  : T;

type Document<T extends Schema> = SchemaType<T>["infer"];
type Criteria<T extends Schema> = X<Partial<Document<T>>>;

/**
 * ModificationSchema is a type that represents a partial document with
 * optional fields. These optional fields, if provided, will update the
 * corresponding document fields. These fields can be nested, and if the field
 * itself is optional, it can be set to null to remove it from the document
 * altogether before an update operation.
 */
type ModificationSchema<T extends Schema> = T extends { [key: string]: Schema }
  ? {
      [K in keyof T]?: T[K] extends OptionalType<infer U>
        ? // In the case of optional fields, they can also be set to null to
          // remove them from the document altogether. Here we unwrap the
          // original OptionalType and ensure that it is a union of the
          // original type and null.
          OptionalType<UnionType<[NullType, U]>>
        : T[K] extends { [key: string]: Schema }
          ? ModificationSchema<T[K]>
          : T[K];
    }
  : T;

type Delta<T extends Schema> = SchemaType<ModificationSchema<T>>["infer"];
/*{
  [K in keyof T]?: Document<T[K]> | null;
};*/

type Fields<T> = {
  [K in keyof T]?: true;
};

type Filter<A, B = undefined> = B extends undefined
  ? A
  : {
      [K in keyof A as K extends keyof B
        ? B[K] extends true
          ? K
          : never
        : never]: A[K];
    };

type X<T> = {
  [K in keyof T]: T[K];
} & {};

type RelationOneType = EO;
type RelationManyType = EO;

type Transaction = {
  [Symbol.asyncDispose]: () => Promise<void>;
  commit: () => Promise<void>;
};

type Store<T extends Schema> = {
  //get schema(): T;
  //  one(): RelationOneType;
  // many(): RelationManyType;
  get(id: Primary): Promise<Document<T>>;
  find(criteria: Criteria<T>): Promise<Filter<Document<T>, undefined>[]>;
  find<F extends Fields<Document<T>>>(
    criteria: Criteria<T>,
    fields: F,
  ): Promise<Filter<Document<T>, F>[]>;
  count(criteria?: Criteria<T>): Promise<Count>;
  exists(criteria: Criteria<T>): Promise<boolean>;
  insert(document: Document<T>): Promise<Document<T>>;
  update(criteria: Criteria<T>, set: Delta<T>): Promise<Document<T>>;
  //save(document: Document<T>): Promise<Document<T>>;
  delete(criteria: Criteria<T>): Promise<void>;
  query(): Query<T>;
  transaction(): Promise<Transaction>;
};

/**
 * Apply a recursive merge delta operation to a document and return a new
 * document with all the changes applied.
 *
 * @param {SchemaType<T>["infer"]} document - Document to apply the delta to
 * @param {Delta<T>} delta - Delta object containing changes to apply to the
 * document
 * @param {Set<unknown> | undefined} seen - Set of already seen objects to
 * avoid infinite recursion
 * @returns {typeof document}
 */
const applyDelta = <T extends Schema>(
  document: SchemaType<T>["infer"],
  delta: Delta<T>,
  seen?: Set<unknown> = new Set<unknown>(),
): SchemaType<T>["infer"] => {
  // 1. Make sure delta is an object
  if (typeof delta === "object" && !Array.isArray(delta)) {
    // 2. Are we recursive for *just* this object
    if (seen.has(delta))
      throw new Error(
        "Infinite recursion detected, please check your delta object.",
      );
    seen.add(delta);
  } else {
    throw new Error("Invalid delta object, please check your delta object.");
  }

  // The only possible keys/symbols that need to be updated are in the document
  // and the delta
  const keys = new Set<keyof SchemaType<T>["infer"]>([
    ...Object.getOwnPropertyNames(document),
    ...Object.getOwnPropertySymbols(document),
    ...Object.getOwnPropertyNames(delta),
    ...Object.getOwnPropertySymbols(delta),
  ]);

  // Allocate a new object to hold the updated values
  const output = {} as SchemaType<T>["infer"];

  for (const key of keys) {
    // Values inside delta are overriding values inside document
    if (key in delta) {
      const deltaValue = delta[key];
      // Null delta values are "Removing" the key
      if (deltaValue === null) continue;

      // object values traverse recursively
      if (typeof deltaValue === "object" && !Array.isArray(deltaValue)) {
        const replacement = applyDelta(
          document[key],
          deltaValue,
          // The recursion only matters if a nested object is inside a parent.
          // For example, if the delta is `{ a: b, c: b, e: b }`, visiting `b`
          // three times is safe. It's only a problem if `b` is recursive with
          // itself. It is also assumed that the documents found and passed to
          // applyDelta are not recursive.
          new Set(seen),
        );
        output[key] = replacement;
      } else {
        // primitive values are directly assigned, including arrays
        output[key] = deltaValue;
      }
    } else {
      // default to whatever is in the document
      output[key] = document[key];
    }
  }
  return output;
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
      // This method updates a document that already exists in the database.
      // It first finds the document using the provided query, then applies
      // the delta to the found document. Finally, it inserts the updated
      // document back into the database. It uses a disposable transaction
      // to ensure that the database is left in a consistent state.
      try {
        await using transaction = await this.transaction();
        const found = await this.find(query);
        const updated = applyDelta(found, document);
        const inserted = await this.insert(updated);
        await transaction.commit();
        return inserted;
      } catch (ex) {
        await transaction.rollback();
        throw ex;
      }
    },
    // async save(document) {
    //   is(document).object();
    //
    //   return o.validate({});
    // },
    async delete(query) {
      is(query).object();
    },
    query() {
      return new Query(spec);
    },
    async transaction() {
      // I don't think this particular strategy is the best way to implement
      // transactions. This should be probably done on the DB level, but it
      // looks like the Store doesn't see the parent database engine.
      let committed = false;
      return {
        [Symbol.asyncDispose]: async () => {
          if (!committed) {
            await this.rollback();
          }
        },
        commit: async () => {
          // perform the commit?
          committed = true;
        },
      };
    },
  };
};
