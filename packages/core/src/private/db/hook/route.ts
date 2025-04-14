import storage from "#db/storage";
import type { RequestHook } from "#module-loader";

export default (): RequestHook => async (request, next) => {
  const response = await new Promise<Response>(resolve => {
    storage.run({}, async () => {
      resolve(await next(request) as Response);
    });
  });

  return response;
};
