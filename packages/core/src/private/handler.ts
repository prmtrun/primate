import type BodyInit from "#BodyInit";
import type { ServeApp } from "#serve/app";
import type MaybePromise from "@rcompat/type/MaybePromise";

type Options = ResponseInit;

export default <T>(mime: string, mapper: (input: T) => BodyInit[0]) =>
  (body: T, options?: Options): (app: ServeApp) => MaybePromise<Response> =>
    (app => app.respond(mapper(body), app.media(mime, options)));
