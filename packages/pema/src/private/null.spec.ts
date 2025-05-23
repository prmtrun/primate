import expect from "#expect";
import null_type from "#null";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => null_type.validate(undefined)).throws(expect("nl", undefined));
});

test.case("pass", assert => {
  assert(null_type).type<"NullType">();
  assert(null_type.validate(null)).equals(null).type<null>();
});
