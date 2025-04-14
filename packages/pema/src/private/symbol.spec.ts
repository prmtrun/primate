import expect from "#expect";
import symbol from "#symbol";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => symbol.validate("true")).throws(expect("sy", "true"));
});

test.case("pass", assert => {
  const s = Symbol();

  assert(symbol).type<"SymbolType">();
  assert(symbol.validate(s)).equals(s).type<symbol>();
});
