import bigint from "#bigint";
import type BigIntType from "#BigIntType";
import boolean from "#boolean";
import type BooleanType from "#BooleanType";
import type ConstructorType from "#ConstructorType";
import type LiteralType from "#LiteralType";
import string from "#string";
import type StringType from "#StringType";
import union from "#union";
import type UnionType from "#UnionType";
import test from "@rcompat/test";

test.case("less than 2 members", assert => {
  const error = "union type must have at least two members";
  // 0 members
  try {
    assert(union()).type<UnionType<[]>>();
  } catch {
    // noop
  }
  assert(() => union()).throws(error);

  // 1 member
  try {
    assert(union(string)).type<UnionType<[StringType]>>();
  } catch {
    // noop
  }
  assert(() => union(string)).throws(error);
});

test.case("flat", assert => {
  const bs = union(boolean, string);

  assert(bs).type<UnionType<[BooleanType, StringType]>>();
  assert(bs.validate("foo")).equals("foo").type<boolean | string>();
  assert(bs.validate(true)).equals(true).type<boolean | string>();
  const bs_e = "expected `boolean | string`, got `1` (number)";
  assert(() => bs.validate(1)).throws(bs_e);

  const fb = union("foo", "bar");
  assert(fb).type<UnionType<[LiteralType<"foo">, LiteralType<"bar">]>>();
  assert(fb.validate("foo")).equals("foo").type<"foo" | "bar">();
  assert(fb.validate("bar")).equals("bar").type<"foo" | "bar">();
  const fb_e = "expected `\"foo\" | \"bar\"`, got `1` (number)";
  assert(() => fb.validate(1)).throws(fb_e);
});

test.case("deep", assert => {
  const u = union(string, { foo: bigint, bar: "baz" });
  const u_e = `string | { foo: bigint, bar: "baz" }`;

  assert(u).type<UnionType<[StringType, {
    foo: BigIntType;
    bar: LiteralType<"baz">;
  }]>>();
  assert(u.validate("foo")).equals("foo")
    .type<string | { foo: bigint; bar: "baz" }>();
  assert(() => u.validate(1)).throws(`expected \`${u_e}\`, got \`1\` (number)`);
});

test.case("classes", assert => {
  class Class {};
  const c = new Class();

  const u = union(string, Class);
  const u_e = `string | class Class {}`;

  assert(u).type<UnionType<[StringType, ConstructorType<typeof Class>]>>();
  assert(u.validate("foo")).equals("foo").type<string | Class>();
  assert(u.validate(c)).equals(c).type<string | Class>();
  assert(() => u.validate(1)).throws(`expected \`${u_e}\`, got \`1\` (number)`);
});
