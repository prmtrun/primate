import type RequestFacade from "#RequestFacade";
import type ResponseLike from "#ResponseLike";

type RouteGuard = (request: RequestFacade) =>
  ResponseLike | true | Promise<true>;

export { RouteGuard as default };
