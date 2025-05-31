import _schema from "pema";
import type Schema from "pema/Schema";

type SchemaType<T extends Schema> = ReturnType<typeof _schema<T>>;
type Document<T extends Schema> = SchemaType<T>["infer"];

type X<T> = {
  [K in keyof T]: T[K]
} & {};

type Filter<T, P extends keyof T> = X<Pick<T, Extract<P, keyof T>>>;

export default class Query<
  T extends Schema,
  P extends keyof Document<T> = keyof Document<T>,
> {
  #schema: SchemaType<T>;
  #projection?: P[];

  constructor(schema: T) {
    this.#schema = _schema(schema);
  }

  select<K extends P>(...projection: K[]): Query<T, K> {
    this.#projection = projection;
    return this as unknown as Query<T, K>;
  }

  async run(): Promise<Filter<Document<T>, P>>{
      return this.#schema.infer as any;
    }
}
