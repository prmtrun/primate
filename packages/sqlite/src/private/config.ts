import Client from "#Client";
import Database from "#Database";

export default (database: string) => {
  const client = new Client(database);

  return new Database(client);
};
