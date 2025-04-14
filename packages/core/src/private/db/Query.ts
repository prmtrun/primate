import object from "pema/object";
import type ObjectProperties from "pema/ObjectProperties";

type ObjectType<T extends ObjectProperties> = ReturnType<typeof object<T>>;
type Document<T extends ObjectProperties> = ObjectType<T>["infer"];

type X<T> = {
  [K in keyof T]: T[K]
} & {};

type Filter<T, P extends keyof T> = X<Pick<T, Extract<P, keyof T>>>;

export default class Query<
  T extends ObjectProperties,
  P extends keyof Document<T> = keyof Document<T>
> {
  #schema: ObjectType<T>;
  #projection?: P;

  constructor(schema: T) {
    this.#schema = object(schema);
  }

  get schema(): ObjectType<T> {
    return this.#schema;
  }

  select<K extends P>(
    projection: K
  ): Query<T, K> {
    this.#projection = projection;
    return this as unknown as Query<T, K>;
  }

  async run(): Promise<Filter<Document<T>, P>> {
    return this.#schema.infer;
  }
};
