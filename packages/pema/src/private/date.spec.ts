import date from "#date";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => date.validate("1")).throws(expect("d", "1"));
});

test.case("pass", assert => {
  const d = new Date();
  assert(date.validate(d)).equals(d).type<Date>();
});
