import expect from "#expect";
import t_undefined from "#undefined";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => t_undefined.validate(null)).throws(expect("u", null));
});

test.case("pass", assert => {
  assert(t_undefined.validate(undefined)).equals(undefined).type<undefined>();
});
