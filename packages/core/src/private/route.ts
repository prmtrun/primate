import type RouteFunction from "#RouteFunction";
import type Verb from "#Verb";

export default (route: { [k in Verb]?: RouteFunction; }) => route;
