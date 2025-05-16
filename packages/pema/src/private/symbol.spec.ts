import expect from "#expect";
import symbol from "#symbol";
import test from "@rcompat/test";
import type SymbolType from "#SymbolType";
import type DefaultType from "#DefaultType";

test.case("fail", assert => {
  assert(() => symbol.validate("true")).throws(expect("sy", "true"));
});

test.case("pass", assert => {
  assert(symbol).type<SymbolType>();

  const s = Symbol();
  assert(symbol.validate(s)).equals(s).type<symbol>();
});

test.case("default", assert => {
  const foo_s = Symbol("foo");
  const bar_s = Symbol("bar");

  [symbol.default(foo_s), symbol.default(() => foo_s)].forEach(d => {
    assert(d).type<DefaultType<SymbolType, typeof foo_s>>();
    assert(d.validate(undefined)).equals(foo_s).type<symbol>();
    assert(d.validate(foo_s)).equals(foo_s).type<symbol>();
    assert(d.validate(bar_s)).equals(bar_s).type<symbol>();
    assert(() => d.validate(1)).throws(expect("sy", 1));
  });
});
