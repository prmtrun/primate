import NoStoreDirectory from "@primate/store/errors/no-store-directory";

export default (directory, driver_build) => async (app, next) => {
  const root = app.root.join(directory);
  if (!await root.exists()) {
    NoStoreDirectory.warn(app.log, root);
    return next(app);
  }

  await driver_build();

  await app.stage(app.root.join(directory), directory);

  app.server_build.push("stores");

  return next(app);
};
