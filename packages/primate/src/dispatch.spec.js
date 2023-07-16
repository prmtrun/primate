import {mark} from "./Logger.js";
import dispatch from "./dispatch.js";

const number = (value, name) => {
  const n = Number(value);
  if (Number.isNaN(n)) {
    throw new Error(`\`${name}\` is not a number`);
  }
  return n;
};

export default test => {
  test.case("get", async assert => {
    const d = dispatch();
    assert(d(null).get()).null();
    assert(d({}).get()).equals({});
    assert(d({foo: "bar"}).get()).equals({foo: "bar"});
    assert(d({foo: "bar"}).get("foo")).equals("bar");
    assert(d({foo: "bar", bar: "baz"}).get()).equals({foo: "bar", bar: "baz"});
    assert(d({foo: "bar", bar: "baz"}).get("foo")).equals("bar");
    assert(d({foo: "bar", bar: "baz"}).get("bar")).equals("baz");
  });
  test.case("patch", async assert => {
    const d = dispatch({number});
    const error = mark("mismatched type :: {0}", "`foo` is not a number");
    assert(() => d({}).getNumber()).throws("`number` called without property");
    assert(() => d({}).getNumber("foo")).throws(error);
    assert(() => d({}).getNumber("foo")).throws(error);
    assert(() => d({foo: "bar"}).getNumber("foo")).throws(error);
  });
};
