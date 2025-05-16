import date from "#date";
import type DateType from "#DateType";
import type DefaultType from "#DefaultType";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => date.validate("1")).throws(expect("d", "1"));
});

test.case("pass", assert => {
  assert(date).type<"DateType">();

  const d = new Date();
  assert(date.validate(d)).equals(d).type<Date>();
});

test.case("default", assert => {
  const da = new Date();
  const da1 = new Date();

  [date.default(da), date.default(() => da)].forEach(d => {
    assert(d).type<DefaultType<DateType, Date>>();
    assert(d.validate(undefined)).equals(da).type<Date>();
    assert(d.validate(da)).equals(da).type<Date>();
    assert(d.validate(da1)).equals(da1).type<Date>();
    assert(() => d.validate(1)).throws(expect("d", 1));
  });
});
