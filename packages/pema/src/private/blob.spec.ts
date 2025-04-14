import blob from "#blob";
import expect from "#expect";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => blob.validate("1")).throws(expect("bb", "1"));
});

test.case("pass", assert => {
  const b = new Blob();
  assert(blob.validate(b)).equals(b).type<Blob>();

  // file extends blob
  const f = new File([""], "");
  assert(blob.validate(f)).equals(f).type<Blob>();
});
