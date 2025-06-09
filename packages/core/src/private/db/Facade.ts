import type EO from "@rcompat/type/EO";

type Criteria = EO;
type Projection = EO[];
type FindOptions = EO;
type Document = EO;

type SchemaFacade = {
  create(schema: string, description: EO): void;
  drop(schema: string): void;
};

export default abstract class Facade {
  abstract schema: SchemaFacade;

  abstract exists(
    collection: string,
    key: string
  ): boolean;

  abstract find(
    collection: string,
    criteria: Criteria,
    projection: Projection,
    options: FindOptions,
  ): Document[];

  abstract count(
    collection: string,
    criteria: Criteria,
  ): number;

  abstract get(
    collection: string,
    primary: string,
    value: string,
  ): Document;

  abstract insert(
    collection: string,
    primary: string,
    document: Document,
  ): Document;

  abstract update(
    collection: string,
    criteria: Criteria,
    delta: Document): number;

  abstract delete(
    collection: string,
    criteria: Criteria,
  ): void;
};
