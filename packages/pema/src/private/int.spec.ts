import type DefaultType from "#DefaultType";
import expect from "#expect";
import int from "#int";
import type IntType from "#IntType";
import type MaybeInt from "#MaybeInt";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => int.validate("1")).throws(expect("i", "1"));
  assert(() => int.validate(1.1)).throws(expect("i", 1.1));
});

test.case("pass", assert => {
  assert(int).type<IntType>();

  assert(int.validate(1)).equals(1).type<MaybeInt>();
  assert(int.validate(-1)).equals(-1).type<MaybeInt>();
  assert(int.validate(1n)).equals(1n).type<MaybeInt>();
});

test.case("default", assert => {
  [int.default(1n), int.default(() => 1n)].forEach(d => {
    assert(d).type<DefaultType<IntType, 1n>>();
    assert(d.validate(undefined)).equals(1n).type<MaybeInt>();
    assert(d.validate(1n)).equals(1n).type<MaybeInt>();
    assert(d.validate(0n)).equals(0n).type<MaybeInt>();
    assert(() => d.validate(1.2)).throws(expect("i", 1.2));
  });
});
