import bigint from "#bigint";
import boolean from "#boolean";
import type BooleanType from "#BooleanType";
import optional from "#optional";
import type OptionalType from "#OptionalType";
import schema from "#schema";
import string from "#string";
import test from "@rcompat/test";

const b = optional(boolean);

test.case("empty", assert => {
  assert(b).type<OptionalType<BooleanType>>();

  const e = b.validate(undefined);
  assert<typeof e>(e).equals(undefined).type<boolean | undefined>();
});

test.case("object", assert => {
  const s = schema({
    foo: optional(string),
    bar: {
      baz: bigint,
    },
  });

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
