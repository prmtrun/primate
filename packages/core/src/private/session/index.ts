import schema from "#session/schema";
import local_storage from "#session/storage";
import s_config from "#symbol/config";

export default <Data>(config: typeof schema.input = {}) => {
  const storage = local_storage<Data>();
  const session = () => storage.getStore()!;
  const validated_config = schema.validate(config);

  return {
    get [s_config]() {
      return validated_config;
    },
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
