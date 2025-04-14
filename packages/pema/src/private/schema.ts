import array from "#array";
import type ArrayType from "#ArrayType";
import type Infer from "#Infer";
import is_validated_type from "#is_validated_type";
import null_type from "#null";
import tuple from "#tuple";
import type TupleType from "#TupleType";
import undefined_type from "#undefined";
import type NullType from "#NullType";
import type UndefinedType from "#UndefinedType";
import Validated from "#Validated";
import PrintableGeneric from "@rcompat/type/PrintableGeneric";

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Flatten<T> = { [K in keyof T]: T[K] } & {};

type DeepMutable<T> =
  T extends readonly [...infer Elements extends readonly unknown[]]
    ? { -readonly [K in keyof Elements]: DeepMutable<Elements[K]> }
    : T extends object
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T;

type DecrementDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type InferSchema<S, Depth extends number = 10> = DeepMutable<
  [Depth] extends [never] ? never :
  S extends Validated<unknown> ? Infer<S> :
  S extends null ? Infer<NullType> :
  S extends undefined ? Infer<UndefinedType> :
  S extends [infer Only] ? Only extends Validated<unknown> ? Infer<ArrayType<Only>> : never :
  S extends Schema[] ? InferSchema<TupleType<{
    [K in keyof S]: S[K] extends Validated<unknown> ? InferSchema<S[K], DecrementDepth[Depth]> : never
  }>> :
  S extends { [key: string]: Schema } ? { [K in keyof S]: InferSchema<S[K], DecrementDepth[Depth]> } :
  never>;

export type Schema =
  Validated<unknown> |
  Schema[] |
  null |
  undefined |
  { [k: string]: Schema };

export class SchemaType<S extends Schema>
  extends Validated<InferSchema<S>, "SchemaType">
  implements PrintableGeneric<S> {
  #schema: S;

  get Type(): S {
    return undefined as unknown as S;
  }

  get name() {
    return "schema";
  }

  constructor(schema: S) {
    super();
    this.#schema = schema;
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
        result[k] = schema((s as any)[k]).validate((x as any)[k], `.${k}`);
      }
      return result;
    }

    if (s === null) {
      if (x !== null) throw new Error("Expected null");
      return null as Infer<this>;
    }

    if (s === undefined) {
      if (x !== undefined) throw new Error("Expected undefined");
      return undefined as Infer<this>;
    }

    throw new Error("Invalid schema structure");
  }
}

type OneElementArray<T> = T extends [infer U] ? [U] extends T ? U : never : never;

/*type NormalizeSchema<S, Depth extends number = 10> =
  [Depth] extends [never] ? never :
  S extends Validated<unknown> ? S :
  S extends null ? NullType :
  S extends undefined ? UndefinedType :
  S extends [unknown] ?
    OneElementArray<S> extends Validated<unknown> ? ArrayType<OneElementArray<S>> : never :
  S extends Schema[] ? TupleType<S> :
  S extends { [K: string]: Schema } ? Flatten<Mutable<S>> :
  never*/
;
type NormalizeSchema<S> =
  S extends [] ? TupleType<[]> :
  S extends Validated<unknown> ? S :
  S extends null ? NullType :
  S extends undefined ? UndefinedType :
  S extends [infer O] ?
    O extends Validated<unknown> ? ArrayType<NormalizeSchema<O>> : never :
  S extends Schema[] ? TupleType<S> :
  S extends { [K: string]: Schema } ? {
    [K in keyof S]: NormalizeSchema<S[K]>;
  } :
  never;



export default function schema<const S extends Schema>(s: S): SchemaType<NormalizeSchema<S>> {
  if (s === null) {
    return new SchemaType(null_type) as never;
  }
  if (s === undefined) {
    return new SchemaType(undefined_type) as never;
  }
  if (Array.isArray(s)) {
    if (s.length === 1 && is_validated_type(s[0])) {
      return array(s[0]) as never;
    } else {
      return tuple(...s) as never;
    }
  }
  return new SchemaType<NormalizeSchema<typeof s>>(s as NormalizeSchema<typeof s>);


}
