import type { LogLevel } from "#loglevel";
import type { Module } from "#module-loader";
import InMemorySessionManager from "#session/InMemoryManager";
import SessionManager from "#session/Manager";
import type Path from "@rcompat/fs/Path";
import type Dictionary from "@rcompat/type/Dictionary";
import type { BuildOptions } from "esbuild";

type CSPProperties = "script-src" | "style-src";

export type CSP = {
  [K in CSPProperties]?: string[];
};

import boolean from "pema/boolean";
import int from "pema/int";
import schema from "pema";
import string from "pema/string";
import union from "pema/union";
import constructor from "pema/constructor";
import record from "pema/record";
import FileRef from "@rcompat/fs/FileRef";

const _pema_config = schema({
  base: string.default("/"),
  //modules: [Module],
  pages: {
    app: string.default("app.html"),
    error: string.default("error.html"),
  },
  log: {
    //level: LogLevel,
    trace: boolean.default(true),
  },
  http: {
    host: string.default("localhost"),
    port: int.default(6161),
    csp: {},
    static: {
      root: string.default("/"),
    },
    ssl: {
      key: union(FileRef, string).optional(),
      cert: union(FileRef, string).optional(),
    },
  },
  session: {
    manager: constructor(SessionManager)
      .default(() => new InMemorySessionManager()),
    implicit: boolean.default(false),
    cookie: {
      name: string.default("session_id"),
      same_site: union("Strict", "Lax", "None"),
      http_only: boolean.default(true),
      path: string.startsWith("/").default("/"),
    },
  },
  request: {
    body: {
      parse: boolean.default(true),
    },
  },
  build: {
    name: string.default("app"),
    includes: [string],
    excludes: [string],
    define: record(string, string),
  },
});

export type Config = {
  base: string;
  modules?: Module[];
  pages: {
    app: string;
    error: string;
  };
  log: {
    level: LogLevel;
    trace: boolean;
  };
  http: {
    host: string;
    port: number;
    csp?: CSP;
    headers?: Dictionary;
    static: {
      root: string;
    };
    ssl?: {
      key: Path;
      cert: Path;
    };
  };
  session: {
    manager: SessionManager;
    implicit: boolean;
    cookie: {
      name: string;
      same_site: "Strict" | "Lax" | "None";
      http_only: boolean;
      path: `/${string}`;
    };
  };
  request: {
    body: {
      parse: boolean;
    };
  };
  location: {
    // renderable components
    components: string;
    // HTML pages
    pages: string;
    // hierarchical routes
    routes: string;
    // static assets
    static: string;
    // build environment
    build: string;
    // client build
    client: string;
    // server build
    server: string;
    // stores
    stores: string;
  };
  build: BuildOptions & {
    name: string;
    includes: string[];
    excludes: string[];
  };
};

export default {
  base: "/",
  modules: [],
  pages: {
    app: "app.html",
    error: "error.html",
  },
  log: {
    level: "warn",
    trace: false,
  },
  http: {
    host: "localhost",
    port: 6161,
    csp: {},
    static: {
      root: "/",
    },
  },
  session: {
    manager: new InMemorySessionManager(),
    implicit: false,
    cookie: {
      name: "session_id",
      same_site: "Strict",
      http_only: true,
      path: "/",
    },
  },
  request: {
    body: {
      parse: true,
    },
  },
  location: {
    // renderable components
    components: "components",
    // HTML pages
    pages: "pages",
    // hierarchical routes
    routes: "routes",
    // static assets
    static: "static",
    // build environment
    build: "build",
    // client build
    client: "client",
    // server build
    server: "server",
    // stores
    stores: "stores",
  },
  build: {
    name: "app",
    includes: [],
    excludes: [],
    define: {},
  },
} as const satisfies Config;
