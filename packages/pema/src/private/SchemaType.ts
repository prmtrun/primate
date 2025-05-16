import GenericType from "#GenericType";
import type Infer from "#Infer";
import type InferSchema from "#InferSchema";
import OptionalType from "#OptionalType";
import type Schema from "#Schema";
import Validated from "#Validated";
import schema from "#index";

export default class SchemaType<S extends Schema>
  extends GenericType<S, InferSchema<S>, "SchemaType"> {
  #schema: S;

  constructor(s: S) {
    super();
    this.#schema = s;
  }

  optional() {
    return new OptionalType(this);
  }

  get name() {
    return "schema";
  }

  validate(x: unknown, key?: string): Infer<this> {
    const s = this.#schema;

    if (s instanceof Validated) {
      return s.validate(x, key) as Infer<this>;
    }

    if (Array.isArray(s)) {
      if (s.length === 1) {
        if (!Array.isArray(x)) throw new Error("Expected array");
        return x.map((item) => schema(s[0]).validate(item, key)) as any;
      } else {
        if (!Array.isArray(x)) throw new Error("Expected tuple");
        if (x.length !== s.length) throw new Error("Tuple length mismatch");
        return s.map((sch, i) => schema(sch).validate(x[i], key)) as any;
      }
    }

    if (typeof s === "object" && s !== null) {
      if (typeof x !== "object" || x === null) {
        throw new Error("Expected object");
      }
      const result: any = {};
      for (const k in s) {
        const r = schema((s as any)[k]).validate((x as any)[k], `.${k}`);
        // exclude undefined (optionals)
        if (r !== undefined) {
          result[k] = r;
        }
      }
      return result;
    }

    if (s === null) {
      if (x !== null) throw new Error("Expected null");
      return null as unknown as Infer<this>;
    }

    if (s === undefined) {
      if (x !== undefined) throw new Error("Expected undefined");
      return undefined as Infer<this>;
    }

    throw new Error("Invalid schema structure");
  }
}
