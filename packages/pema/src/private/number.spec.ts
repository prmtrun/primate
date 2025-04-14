import expect from "#expect";
import number from "#number";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => number.validate("1")).throws(expect("n", "1"));
  assert(() => number.validate(1n)).throws(expect("n", 1n));
});

test.case("pass", assert => {
  assert(number.validate(1)).equals(1).type<number>();
});
