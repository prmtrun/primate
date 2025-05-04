import boolean from "#boolean";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => boolean.validate("true")).throws(expect("b", "true"));
});

test.case("pass", assert => {
  assert(boolean).type<"BooleanType">();

  assert(boolean.validate(true)).equals(true).type<boolean>();
  assert(boolean.validate(false)).equals(false).type<boolean>();
});
