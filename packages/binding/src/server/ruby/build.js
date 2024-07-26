import { File } from "rcompat/fs";
import { upperfirst } from "rcompat/string";

const routes_re = /def (?<route>get|post|put|delete)/gu;
const get_routes = code => [...code.matchAll(routes_re)]
  .map(({ groups: { route } }) => route);

const directory = new File(import.meta.url).up(1);
const session_rb = await directory.join("session.rb").text();
const request = await directory.join("./request.rb").text();
const make_route = route => `async ${route.toLowerCase()}(request) {
    return to_response(await environment.callAsync("run_${route}",
      vm.wrap(request), vm.wrap(helpers)));
  },`;

const type_map = {
  i8: { transfer: "to_i", type: "int8" },
  i16: { transfer: "to_i", type: "int16" },
  i32: { transfer: "to_i", type: "int32" },
  i64: { transfer: "to_i", type: "int64" },
  f32: { transfer: "to_f", type: "float32" },
  f64: { transfer: "to_f", type: "float64" },
  u8: { transfer: "to_i", type: "uint8" },
  u16: { transfer: "to_i", type: "uint16" },
  u32: { transfer: "to_i", type: "uint32", nullval: "0" },
  u64: { transfer: "to_i", type: "uint64" },
  string: { transfer: "to_s", type: "string" },
  uuid: { transfer: "to_s", type: "string" },
};

const create_ruby_wrappers = routes => routes.map(route =>
  `def run_${route}(js_request, helpers)
  ${route}(Request.new(js_request, helpers))
end`).join("\n");

const js_wrapper = async (path, routes, app) => {
  const has_session = app.modules.names.includes("primate:session");
  const classes = [];
  const request_initialize = [];
  const request_defs = [];
  if (has_session) {
    classes.push(session_rb);
    request_initialize.push(
      "@session = Session.new(request[\"session\"], helpers)",
    );
    request_defs.push(`def session
  @session
end`);
  }

  return `
  import to_response from "@primate/binding/ruby/to-response";
  import { module, rubyvm, helpers } from "@primate/binding/ruby/common";
  import { File } from "rcompat/fs";

const { vm } = await rubyvm(module);
const file = await File.text(${JSON.stringify(path)});
const wrappers = ${JSON.stringify(create_ruby_wrappers(routes))};
const request = ${JSON.stringify(request
    .replace("%%CLASSES%%", _ => classes.join("\n"))
    .replace("%%REQUEST_INITIALIZE%%", _ => request_initialize.join("\n"))
    .replace("%%REQUEST_DEFS%%", _ => request_defs.join("\n")))};

const environment = await vm.evalAsync(request+file+wrappers);

export default {
  ${routes.map(route => make_route(route)).join("\n  ")}
};
`;
};

export default ({ extension } = {}) => (app, next) => {
  //await depend(import.meta.filename, dependencies, `primate:${name}`);
  //
  app.bind(extension, async (directory, file) => {
    const path = directory.join(file);
    const base = path.directory;
    const js = path.base.concat(".js");
    const code = await path.text();
    const routes = get_routes(code);
    // write .js wrapper
    await base.join(js).write(await js_wrapper(`${path}`, routes, app));
  });

  return next(app);
};
