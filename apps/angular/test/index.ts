import test from "primate/test";
import FileRef from "@rcompat/fs/FileRef";

const expected = await FileRef.text("./index.expected.html");

test.get("/", response => {
  response.body.equals(expected);
});
