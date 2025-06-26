import type RouteFunction from "#RouteFunction";
import type Verb from "#Verb";

type RouteExport = {
  body?: {
    parse?: boolean;
  };
  default: {
    [k in Verb]: RouteFunction;
  };
};

export { RouteExport as default };
