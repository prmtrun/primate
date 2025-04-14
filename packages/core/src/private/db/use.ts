import store from "#db/store";
import string from "pema/string";
import number from "pema/number";

const S = store({
  name: string,
  lastname: string,
  age: number,
});

const r = await S.query().select("lastname").run();

const _ = await S.find({ name: "string" });

const users = await S.find({ name: "string" }, { name: true, lastname: true });

const users2 = await S.find({ name: "string" }, { age: true });
