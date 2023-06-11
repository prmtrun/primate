import crypto from "runtime-compat/crypto";
import {tryreturn} from "runtime-compat/flow";
import {File, Path} from "runtime-compat/fs";
import {bold, blue} from "runtime-compat/colors";
import {transform, valmap} from "runtime-compat/object";
import * as handlers from "./handlers/exports.js";
import * as hooks from "./hooks/exports.js";
import * as loaders from "./loaders/exports.js";
import dispatch from "./dispatch.js";
import {print} from "./Logger.js";

const base = new Path(import.meta.url).up(1);
// do not hard-depend on node
const packager = import.meta.runtime?.packager ?? "package.json";
const library = import.meta.runtime?.library ?? "node_modules";

// use user-provided file or fall back to default
const index = (app, name) =>
  tryreturn(async _ => File.read(`${app.paths.pages.join(name)}`))
    .orelse(async _ => base.join("defaults", app.config.index).text());

const hash = async (string, algorithm = "sha-384") => {
  const encoder = new TextEncoder();
  const bytes = await crypto.subtle.digest(algorithm, encoder.encode(string));
  const algo = algorithm.replace("-", _ => "");
  return `${algo}-${btoa(String.fromCharCode(...new Uint8Array(bytes)))}`;
};

const attribute = attributes => Object.keys(attributes).length > 0 ?
  " ".concat(Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`).join(" "))
  : "";
const tag = ({name, attributes = {}, code = "", close = true}) =>
  `<${name}${attribute(attributes)}${close ? `>${code}</${name}>` : "/>"}`;

export default async (config, root, log) => {
  const {http} = config;
  const secure = http?.ssl !== undefined;
  const {name, version} = await base.up(1).join(packager).json();
  const paths = valmap(config.paths, value => root.join(value));
  paths.client = paths.build.join("client");
  paths.server = paths.build.join("server");

  const at = `at http${secure ? "s" : ""}://${http.host}:${http.port}\n`;
  print(blue(bold(name)), blue(version), at);

  // if ssl activated, resolve key and cert early
  if (secure) {
    http.ssl.key = root.join(http.ssl.key);
    http.ssl.cert = root.join(http.ssl.cert);
  }

  const types = await loaders.types(log, paths.types);

  const app = {
    config,
    secure,
    name,
    version,
    importmaps: {},
    assets: [],
    entrypoints: [],
    paths,
    root,
    log,
    async copy(source, target, filter = /^.*.js$/u) {
      const jss = await source.collect(filter);
      await Promise.all(jss.map(async js => {
        const file = await js.file.read();
        const to = await target.join(js.path.replace(source, ""));
        await to.directory.file.create();
        await to.file.write(file);
      }));
    },
    headers: _ => {
      const csp = Object.keys(http.csp).reduce((policy_string, key) =>
        `${policy_string}${key} ${http.csp[key]};`, "");
      const scripts = app.assets
        .filter(({type}) => type !== "style")
        .map(asset => `'${asset.integrity}'`).join(" ");
      const _csp = scripts === "" ? csp : `${csp}script-src 'self' ${scripts};`;
      // remove inline assets
      app.assets = app.assets.filter(({inline, type}) => !inline
        || type === "importmap");

      return {
        "Content-Security-Policy": _csp,
        "Referrer-Policy": "same-origin",
      };
    },
    handlers: {...handlers},
    render: async ({body = "", head = "", page} = {}) => {
      const html = await index(app, page ?? config.index);
      // inline: <script type integrity>...</script>
      // outline: <script type integrity src></script>
      const script = ({inline, code, type, integrity, src}) => inline
        ? tag({name: "script", attributes: {type, integrity}, code})
        : tag({name: "script", attributes: {type, integrity, src}});
      // inline: <style>...</style>
      // outline: <link rel="stylesheet" href/>
      const style = ({inline, code, href, rel = "stylesheet"}) => inline
        ? tag({name: "style", code})
        : tag({name: "link", attributes: {rel, href}, close: false});
      const heads = app.assets
        .toSorted(({type}) => -1 * (type === "importmap"))
        .map(({src, code, type, inline, integrity}) =>
          type === "style"
            ? style({inline, code, href: src})
            : script({inline, code, type, integrity, src})
        ).join("\n");
      return html
        .replace("%body%", _ => body)
        .replace("%head%", _ => `${head}${heads}`);
    },
    publish: async ({src, code, type = "", inline = false}) => {
      if (!inline) {
        const base = paths.client.join(src);
        await base.directory.file.create();
        await base.file.write(code);
      }
      const integrity = await hash(code);
      const _src = new Path(http.static.root).join(src ?? "");
      app.assets.push({src: `${_src}`, code: inline ? code : "", type, inline, integrity});
      return integrity;
    },
    bootstrap: ({type, code}) => {
      app.entrypoints.push({type, code});
    },
    async import(module) {
      const {build} = config;
      const {root} = http.static;
      const path = [library, module];
      const pkg = await Path.resolve().join(...path, packager).json();
      const exports = pkg.exports === undefined
        ? {[module]: `/${module}/${pkg.main}`}
        : transform(pkg.exports, entry => entry
          .filter(([, _export]) => _export.import !== undefined)
          .map(([key, value]) => [
            key.replace(".", module),
            value.import.replace(".", `./${module}`),
          ]));
      await Promise.all(Object.values(exports).map(async name => app.publish({
          code: await Path.resolve().join(library, name).text(),
          src: new Path(root, build.modules, name),
          type: "module",
        })));
      this.importmaps = {
        ...valmap(exports, value => new Path(root, build.modules, value).path),
        ...this.importmaps};
    },
    types,
    routes: await loaders.routes(log, paths.routes),
    dispatch: dispatch(types),
  };

  const modules = await loaders.modules(app, root, config);

  return {...app,
    modules,
    layoutDepth: Math.max(...app.routes.map(({layouts}) => layouts.length)) + 1,
    route: hooks.route({...app, modules}),
    parse: hooks.parse(dispatch(types)),
  };
};
