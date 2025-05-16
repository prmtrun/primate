import boolean from "#boolean";
import type BooleanType from "#BooleanType";
import type DefaultType from "#DefaultType";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => boolean.validate("true")).throws(expect("b", "true"));
});

test.case("pass", assert => {
  assert(boolean).type<BooleanType>();

  assert(boolean.validate(true)).equals(true).type<boolean>();
  assert(boolean.validate(false)).equals(false).type<boolean>();
});

test.case("default", assert => {
  [boolean.default(true), boolean.default(() => true)].forEach(d => {
    assert(d).type<DefaultType<BooleanType, true>>();
    assert(d.validate(undefined)).equals(true).type<boolean>();
    assert(d.validate(true)).equals(true).type<boolean>();
    assert(d.validate(false)).equals(false).type<boolean>();
    assert(() => d.validate("true")).throws(expect("b", "true"));
  });
});
