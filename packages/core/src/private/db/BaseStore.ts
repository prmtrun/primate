import type StoreSchema from "pema/StoreSchema";
type Primary = string;

export default abstract class BaseStore<S extends StoreSchema = StoreSchema> {
  /**
   * *Check whether a document with the given key exists in the database*
   *
   * @param key the document's primary key
   *
   * @returns **true** if a document with the given key exists
   */
  abstract exists(key: Primary): Promise<boolean>;
}
