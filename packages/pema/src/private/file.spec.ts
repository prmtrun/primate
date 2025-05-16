import type DefaultType from "#DefaultType";
import expect from "#expect";
import file from "#file";
import type FileType from "#FileType";
import test from "@rcompat/test";

test.case("fail", assert => {
  assert(() => file.validate("1")).throws(expect("f", "1"));

  const b = new Blob();
  assert(() => file.validate(b)).throws(expect("f", b));
});

test.case("pass", assert => {
  assert(file).type<"FileType">();

  const f = new File([""], "");
  assert(file.validate(f)).equals(f).type<File>();
});

test.case("default", assert => {
  const f = new File([""], "");
  const f1 = new File([""], "");

  [file.default(f), file.default(() => f)].forEach(d => {
    assert(d).type<DefaultType<FileType, File>>();
    assert(d.validate(undefined)).equals(f).type<File>();
    assert(d.validate(f)).equals(f).type<File>();
    assert(d.validate(f1)).equals(f1).type<File>();
    assert(() => d.validate(1)).throws(expect("f", 1));
  });
});
