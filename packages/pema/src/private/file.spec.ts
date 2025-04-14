import expect from "#expect";
import file from "#file";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => file.validate("1")).throws(expect("f", "1"));

  const b = new Blob();
  assert(() => file.validate(b)).throws(expect("f", b));
});

test.case("pass", assert => {
  const f = new File([""], "");
  assert(file.validate(f)).equals(f).type<File>();
});
