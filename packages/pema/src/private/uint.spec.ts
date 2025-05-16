import type DefaultType from "#DefaultType";
import expect from "#expect";
import type MaybeInt from "#MaybeInt";
import uint from "#uint";
import type UintType from "#UintType";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => uint.validate("1")).throws(expect("ui", "1"));
  assert(() => uint.validate(1.1)).throws(expect("ui", 1.1));
  assert(() => uint.validate(-1)).throws(expect("ui", -1));
});

test.case("pass", assert => {
  assert(uint).type<UintType>();

  assert(uint.validate(1)).equals(1).type<MaybeInt>();
  assert(uint.validate(1n)).equals(1n).type<MaybeInt>();
});

test.case("default", assert => {
  [uint.default(1n), uint.default(() => 1n)].forEach(d => {
    assert(d).type<DefaultType<UintType, 1n>>();
    assert(d.validate(undefined)).equals(1n).type<MaybeInt>();
    assert(d.validate(1n)).equals(1n).type<MaybeInt>();
    assert(d.validate(0n)).equals(0n).type<MaybeInt>();
    assert(() => d.validate(-1.2)).throws(expect("ui", -1.2));
  });
});
