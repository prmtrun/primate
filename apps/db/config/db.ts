import db from "primate/config/db";
import sqlite from "@primate/sqlite";

const t = db({
  default: sqlite("/tmp/data.db"),
});

export default t;
