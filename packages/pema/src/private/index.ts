import array from "#array";
import is_validated_type from "#is_validated_type";
import type NormalizeSchema from "#NormalizeSchema";
import null_type from "#null";
import type Schema from "#Schema";
import SchemaType from "#SchemaType";
import tuple from "#tuple";
import undefined_type from "#undefined";

export default function schema<const S extends Schema>(s: S):
  SchemaType<NormalizeSchema<S>> {
  if (s === null) {
    return new SchemaType(null_type) as never;
  }
  if (s === undefined) {
    return new SchemaType(undefined_type) as never;
  }
  if (Array.isArray(s)) {
    if (s.length === 1 && is_validated_type(s[0])) {
      return new SchemaType(array(s[0])) as never;
    } else {
      return new SchemaType(tuple(...s)) as never;
    }
  }
  return new SchemaType<NormalizeSchema<typeof s>>(s as NormalizeSchema<typeof s>);
}
