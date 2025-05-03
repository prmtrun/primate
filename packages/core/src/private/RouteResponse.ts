import type ResponseLike from "#ResponseLike";
import type MaybePromise from "@rcompat/type/MaybePromise";

type RouteResponse = MaybePromise<ResponseLike> | void;

export { RouteResponse as default };
