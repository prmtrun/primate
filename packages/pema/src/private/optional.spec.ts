import bigint from "#bigint";
import type BigIntType from "#BigIntType";
import boolean from "#boolean";
import type BooleanType from "#BooleanType";
import schema from "#index";
import optional from "#optional";
import type OptionalType from "#OptionalType";
import type SchemaType from "#SchemaType";
import string from "#string";
import type StringType from "#StringType";
import test from "@rcompat/test";

const b = optional(boolean);

test.case("empty", assert => {
  assert(b).type<OptionalType<BooleanType>>();

  const e = b.validate(undefined);
  assert<typeof e>(e).equals(undefined).type<boolean | undefined>();
});

test.case("object", assert => {
  type S = SchemaType<{
    foo: OptionalType<StringType>;
    bar: {
      baz: BigIntType;
    };
  }>;

  const s = schema({
    foo: optional(string),
    bar: {
      baz: bigint,
    },
  });
  const sv = schema({
    foo: string.optional(),
    bar: {
      baz: bigint,
    },
  });

  assert(s).type<S>();
  assert(sv).type<S>();

  const sv0 = sv.validate({
    foo: undefined,
    bar: {
      baz: 1n,
    },
  });
  assert(sv0).equals({ bar: { baz: 1n }});

  const s0 = s.validate({
    foo: undefined,
    bar: {
      baz: 1n,
    },
  });
  assert(s0).equals({ bar: { baz: 1n }});

  const s1 = s.validate({
    bar: {
      baz: 1n,
    },
  });
  assert(s1).equals({ bar: { baz: 1n }});
});
