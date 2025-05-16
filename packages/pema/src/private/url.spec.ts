import type DefaultType from "#DefaultType";
import expect from "#expect";
import url from "#url";
import type URLType from "#URLType";
import test from "@rcompat/test";

const address = "https://primate.run";

test.case("fail", assert => {
  assert(() => url.validate(address)).throws(expect("ur", address));
});

test.case("pass", assert => {
  assert(url).type<"URLType">();

  const u = new URL(address);
  assert(url.validate(u)).equals(u).type<URL>();
});

test.case("default", assert => {
  const u = new URL(address);
  const u1 = new URL("https://example.org");

  [url.default(u), url.default(() => u)].forEach(d => {
    assert(d).type<DefaultType<URLType, URL>>();
    assert(d.validate(undefined)).equals(u).type<URL>();
    assert(d.validate(u)).equals(u).type<URL>();
    assert(d.validate(u1)).equals(u1).type<URL>();
    assert(() => d.validate(1)).throws(expect("ur", 1));
  });
});
