import type DefaultType from "#DefaultType";
import expect from "#expect";
import type UintDataType from "#UintDataType";
import type UintType from "#UintType";
import test from "@rcompat/test";

export default <T extends UintDataType>(
  i: UintType<T>, min: number, max: number) => {
  test.case("fail", assert => {
    assert(() => i.validate("1")).throws(expect("n", "1"));
    assert(() => i.validate(1.1)).throws("1.1 is not an integer");
    assert(() => i.validate(-1.1)).throws("-1.1 is not an integer");
    assert(() => i.validate(-1)).throws("-1 out of range");
    assert(() => i.validate(1n)).throws(expect("n", 1n));
  });

  test.case("pass", assert => {
    assert(i).type<UintType<T>>();

    assert(i.validate(1)).equals(1).type<number>();
  });

  test.case("range", assert => {
    assert(i.validate(0)).equals(0).type<number>();
    assert(i.validate(min)).equals(min).type<number>();
    assert(i.validate(max)).equals(max).type<number>();

    assert(() => i.validate(min - 1)).throws(`${min - 1} out of range`);
    assert(() => i.validate(max + 1)).throws(`${max + 1} out of range`);
  });

  test.case("default", assert => {
    [i.default(1), i.default(() => 1)].forEach(d => {
      assert(d).type<DefaultType<UintType<T>, 1>>();
      assert(d.validate(undefined)).equals(1).type<number>();
      assert(d.validate(1)).equals(1).type<number>();
      assert(d.validate(0)).equals(0).type<number>();
      assert(() => d.validate(1.2)).throws("1.2 is not an integer");
      assert(() => d.validate(-1.2)).throws("-1.2 is not an integer");
    });
  });
};
