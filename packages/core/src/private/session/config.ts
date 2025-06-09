import local_storage from "#session/storage";

export default <Data>() => {
  const storage = local_storage<Data>();
  const session = () => storage.getStore()!;

  return {
    get new() {
      return session().new;
    },
    get id() {
      return session().id;
    },
    get data() {
      return session().data;
    },
    create(data: Data = {} as Data) {
      session().create(data);
    },
    destroy() {
      session().destroy();
    },
  };
};
