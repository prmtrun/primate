import type Asset from "#asset";
import type { Config } from "#config";
import defaults from "#config";
import type Mode from "#Mode";
import type RouteExport from "#RouteExport";
import type RouteSpecial from "#RouteSpecial";
import type SessionConfig from "#session/Config";
import override from "@rcompat/record/override";
import type Dictionary from "@rcompat/type/Dictionary";
import type Schema from "pema/Schema";
import init from "../shared/hook/init.js";
import app from "./app.js";
import serve from "./hook/serve.js";
import type loader from "./loader.js";

type Import = Dictionary & {
  default: unknown;
};

export type BuildFiles = {
  routes: [string, RouteExport | RouteSpecial][];
  locales?: [string, {
    default: Dictionary<string>;
  }][];
  stores?: [string, {
    default: Schema;
    name?: string;
  }][];
};

export type Options = {
  config: Config;
  files: BuildFiles;
  components?: [string, Import][];
  mode: Mode;
  target: string;
  loader: ReturnType<typeof loader>;
  assets: Asset[];
  session_config: SessionConfig;
};

export default async (root: string, { config, ...options }: Options) =>
  serve(
    await init(
      await app(root, { config: override(defaults, config), ...options }),
  ));
