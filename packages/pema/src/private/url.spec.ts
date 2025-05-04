import expect from "#expect";
import url from "#url";
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
