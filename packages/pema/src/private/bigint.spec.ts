import bigint from "#bigint";
import type BigIntType from "#BigIntType";
import type DefaultType from "#DefaultType";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => bigint.validate("1")).throws(expect("bt", "1"));
  assert(() => bigint.validate(1)).throws(expect("bt", 1));
});

test.case("pass", assert => {
  assert(bigint).type<BigIntType>();

  assert(bigint.validate(1n)).equals(1n).type<bigint>();
});

test.case("default", assert => {
  [bigint.default(1n), bigint.default(() => 1n)].forEach(d => {
    assert(d).type<DefaultType<BigIntType, 1n>>();
    assert(d.validate(undefined)).equals(1n).type<bigint>();
    assert(d.validate(1n)).equals(1n).type<bigint>();
    assert(d.validate(0n)).equals(0n).type<bigint>();
    assert(() => d.validate(1)).throws("expected bigint, got `1` (number)");
  });
});
