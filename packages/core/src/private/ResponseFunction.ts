import type Component from "#frontend/Component";
import type RequestFacade from "#RequestFacade";
import type { ServeApp } from "#serve/app";
import type Dictionary from "@rcompat/type/Dictionary";
import type MaybePromise from "@rcompat/type/MaybePromise";

type ResponseFunction =
  (app: ServeApp, transfer: Dictionary, request: RequestFacade)
  => MaybePromise<Component | Response | undefined>;

export { ResponseFunction as default };
