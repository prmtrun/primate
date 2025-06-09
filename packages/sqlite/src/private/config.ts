import Client from "#Client";
//import Facade from "#Facade";

export default (database: string) => {
  const client = new Client(database);

  //return new Facade(client);
};
