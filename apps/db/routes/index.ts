import User from "#store/User";

export default {
  async get(request) {
    await User.insert({
      name: "Donald",
    });

    const users = await User.find({ name: "string" }, { name: true });

    return "hi";
  },
};
