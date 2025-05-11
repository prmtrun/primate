import type { default as App, BindFn, TargetHandler } from "#App";
import type { Config } from "#config";
import type Mode from "#Mode";
import module_loader from "#module-loader";
import Build from "@rcompat/build";
import transform from "@rcompat/build/transform";
import FileRef from "@rcompat/fs/FileRef";
import type Path from "@rcompat/fs/Path";
import entries from "@rcompat/record/entries";
import exclude from "@rcompat/record/exclude";
import get from "@rcompat/record/get";
import type MaybePromise from "@rcompat/type/MaybePromise";
import type PartialDictionary from "@rcompat/type/PartialDictionary";
import { web } from "./targets/index.js";
import identity from "@rcompat/function/identity";

const compile_typescript = async (code: string) =>
  (await transform(code, { loader: "ts" })).code;

export const symbols = {
  layout_depth: Symbol("layout.depth"),
};

type ExtensionCompileFunction = (component: FileRef, app: BuildApp) =>
  Promise<void>;

type ExtensionCompile = {
  client: ExtensionCompileFunction;
  server: ExtensionCompileFunction;
};

export interface BuildApp extends App {
  bind: (extension: string, handler: BindFn) => void;
  target: (name: string, target: TargetHandler) => void;
  postbuild: (() => void)[];
  bindings: PartialDictionary<BindFn>;
  roots: FileRef[];
  targets: PartialDictionary<{ forward?: string; target: TargetHandler }>;
  assets: unknown[];
  extensions: PartialDictionary<ExtensionCompile>;
  stage: (source: FileRef, directory: Path,
    mapper?: (text: string) => MaybePromise<string>) => Promise<void>;
  compile: (component: FileRef) => Promise<void>;
  register: (extension: string, compile: ExtensionCompile) => void;
  done: (fn: () => void) => void;
  server_build: string[];
  build_target: string;
  get build(): Build;
  depth(): number;
  get mode(): Mode;
};

type Default = (root: FileRef, config: Config, mode: Mode) => Promise<BuildApp>;

const build: Default = async (root, config, mode = "developement" as Mode) => {
  const path = entries(config.location).valmap(([, value]) => root.join(value))
    .get();
  const error = path.routes.join("+error.js");
  const kv_storage = new Map<symbol, unknown>();
  let _build: Build | undefined = undefined;

  return {
    postbuild: [],
    bindings: {
      // noop
      ".js": () => {},
      ".ts": async (directory, file) => {
        const _path = directory.join(file);
        const base = _path.directory;
        const js = _path.base.concat(".js");
        await base.join(js).write(await compile_typescript(await _path.text()));
      },
    },
    roots: [],
    targets: { web: { target: web } },
    assets: [],
    path,
    root,
    config: <P extends string>(key: P) => get(config, key),
    get mode() {
      return mode;
    },
    get<T>(key: symbol) {
      return kv_storage.get(key) as T;
    },
    set: (key, value) => {
      if (kv_storage.has(key)) {
        // throw erro
      }
      kv_storage.set(key, value);
    },
    error: {
      default: await error.exists() ? await error.import("default") : undefined,
    },
    extensions: {},
    modules: await module_loader(root, config.modules ?? []),
    async stage(source, directory, mapper = identity) {
      if (!await source.exists()) {
        return;
      }

      const target_base = this.runpath(directory.toString());

      await Promise.all((await source.collect()).map(async abs => {
        const rel = FileRef.join(directory, abs.debase(source));
        const is_ts = abs.path.endsWith(".ts");
        let text = await mapper(await abs.text());
        if (is_ts) {
          text = await compile_typescript(text);
        }

        const base = abs.base;
        const extension = abs.extension;
        const outdir = target_base.join(rel.debase(directory)).directory;
        await outdir.create();

        const outfile = outdir.join(base.concat(is_ts ? ".js" : extension));
        await outfile.write(text);
      }));
    },
    async compile(component) {
      const { server, client, components } = this.config("location");

      const compile = this.extensions[component.fullExtension]
        ?? this.extensions[component.extension];
      if (compile === undefined) {
        const source = this.path.build.join(components);
        const debased = `${component.path}`.replace(source.toString(), "");

        const server_target = this.runpath(server, components, debased);
        await server_target.directory.create();
        await component.copy(server_target);

        const client_target = this.runpath(client, components, debased);
        await client_target.directory.create();
        await component.copy(client_target);
      } else {
        // compile server components
        await compile.server(component, this);

        // compile client components
        await compile.client(component, this);
      }
    },
    register(extension, compile) {
      this.extensions[extension] = compile;
    },
    runpath(...directories) {
      return this.path.build.join(...directories);
    },
    bind(extension, handler) {
      this.bindings[extension] = handler;
    },
    target(name, target) {
      this.targets[name] = { target };
    },
    done(fn) {
      this.postbuild.push(fn);
    },
    server_build: ["routes"],
    build_target: "web",
    get build(): Build {
      if (_build === undefined) {
        _build = new Build({
          ...exclude(this.config("build"), ["includes"]),
          outdir: this.runpath(this.config("location.client")).path,
          stdin: {
            contents: "",
            resolveDir: this.root.path,
          },
        }, mode as Mode);
        return _build;
      }
      throw new Error("build not yet initialized");
    },
    depth() {
      return this.get<number>(symbols.layout_depth);
    },
  } as const satisfies BuildApp;
};

export default build;
