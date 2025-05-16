import type DefaultType from "#DefaultType";
import expect from "#expect";
import string from "#string";
import type StringType from "#StringType";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => string.validate(1)).throws(expect("s", 1));
});

test.case("pass", assert => {
  assert(string).type<StringType>();
  assert(string.validate("test")).equals("test").type<string>();
});

test.case("default", assert => {
  [string.default("foo"), string.default(() => "foo")].forEach(d => {
    assert(d).type<DefaultType<StringType, "foo">>();
    assert(d.validate(undefined)).equals("foo").type<string>();
    assert(d.validate("foo")).equals("foo").type<string>();
    assert(d.validate("bar")).equals("bar").type<string>();
    assert(() => d.validate(1)).throws(expect("s", 1));
  });
});
