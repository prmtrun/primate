import db from "primate/config/db";
import sqlite from "@primate/sqlite";

const t = db({
  default: sqlite(":memory:"),
});

export default t;
