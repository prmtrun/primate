import bigint from "#bigint";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => bigint.validate("1")).throws(expect("bt", "1"));
  assert(() => bigint.validate(1)).throws(expect("bt", 1));
});

test.case("pass", assert => {
  assert(bigint).type<"BigIntType">();

  assert(bigint.validate(1n)).equals(1n).type<bigint>();
});
