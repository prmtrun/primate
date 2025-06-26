import Database from "#Database";
import Client from "@rcompat/sqlite";

export default (path: string) => new Database(new Client(path, {
  safeIntegers: true,
}));
