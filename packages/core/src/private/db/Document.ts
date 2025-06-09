import type InferStore from "pema/InferStore";
import type StoreSchema from "pema/StoreSchema";

type X<T> = {
  [K in keyof T]: T[K]
} & {};

type Document<T extends StoreSchema> = X<InferStore<T>>;

export type { Document as default };
