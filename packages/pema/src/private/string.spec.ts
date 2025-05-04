import expect from "#expect";
import string from "#string";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => string.validate(1)).throws(expect("s", 1));
});

test.case("pass", assert => {
  assert(string).type<"StringType">();
  assert(string.validate("test")).equals("test").type<string>();
});
