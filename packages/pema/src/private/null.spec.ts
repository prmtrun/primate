import expect from "#expect";
import t_null from "#null";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => t_null.validate(undefined)).throws(expect("nl", undefined));
});

test.case("pass", assert => {
  assert(t_null.validate(null)).equals(null).type<null>();
});
