import type Dictionary from "@rcompat/type/Dictionary";
import spa from "./spa.js";

type Init = {
  names: string[];
  data: Dictionary[];
  request: Dictionary;
};

type Options = {
  spa: boolean;
  ssr: boolean;
};

export default ({ names, data, request }: Init, options: Options) => `
  import * as components from "app";
  import { make_root, createElement, ReactHead } from "app";

  const { body } = globalThis.window.document;

  ReactHead.clear();
  const root = make_root.${options.ssr ? "ssr" : "csr"}(body,
    createElement(components.root_react, {
      components: [${names.map(name => `components.${name}`).join(", ")}],
      data: ${JSON.stringify(data)},
      request: {
        ...${JSON.stringify(request)},
        url: new URL(location.href),
      },
    })
  );
  ${options.spa ? spa : ""}`;
