import User from "#store/User";
import route from "primate/route";

export default route({
  async put(request) {
    await User.db.schema.create("user", {
      id: "id",
      name: "string",
    });
    await User.db.schema.delete("user");

    /*await User.insert({
      name: "Donald",
    });

    const users = await User.find({ name: "string" }, { name: true });*/

    return "hi";
  },
});
