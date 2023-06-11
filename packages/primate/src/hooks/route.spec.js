import dispatch from "../dispatch.js";
import * as loaders from "../loaders/exports.js";
import route from "./route.js";
import {mark} from "../Logger.js";
const undef = undefined;

const app = {
  config: {
    paths: {
      routes: "/routes",
    },
    types: {
      explicit: false,
    },
  },
  headers: () => ({}),
  modules: {
    route: [],
  },
  routes: await loaders.routes(undef, undef, ({warn = true}) => (warn ? [
    "index",
    "user",
    "users/{userId}a",
    "comments/{commentId=comment}",
    "users/{userId}/comments/{commentId}",
    "users/{userId=user}/comments/{commentId}/a",
    "users/{userId=user}/comments/{commentId=comment}/b",
    "users/{_userId}/comments/{commentId}/d",
    "users/{_userId}/comments/{_commentId}/e",
    "comments2/{_commentId}",
    "users2/{_userId}/{commentId}",
    "users3/{_userId}/{_commentId=_commentId}",
    "users4/{_userId}/{_commentId}",
    "users5/{truthy}",
    "{uuid}/{Uuid}/{UUID}",
  ] : []).map(pathname => [pathname, {get: request => request}])
  ),
  types: {
    user: id => /^\d*$/u.test(id),
    comment: id => /^\d*$/u.test(id),
    _userId: id => /^\d*$/u.test(id),
    _commentId: id => /^\d*$/u.test(id),
    truthy: () => 1,
    uuid: _ => _ === "uuid",
    Uuid: _ => _ === "Uuid",
    UUID: _ => _ === "UUID",
  },
  dispatch: dispatch(),
};

export default test => {
  const router = route(app);
  const p = "https://p.com";
  const r = pathname => {
    const original = new Request(`${p}${pathname}`, {method: "GET"});
    const {url} = original;
    const end = -1;
    return router({
      original,
      url: new URL(url.endsWith("/") ? url.slice(0, end) : url),
    });
  };

  test.reassert(assert => ({
    match: (url, expected) => {
      assert(r(url).pathname.toString()).equals(expected.toString());
    },
    fail: (url, result) => {
      const throws = mark("no {0} route to {1}", "GET", result ?? url);
      assert(() => r(url)).throws(throws);
    },
    path: (url, result) => {
      assert(r(url).path.get()).equals(result);
    },
    assert,
  }));

  test.case("index route", ({match}) => {
    match("/", /^\/$/u);
  });
  test.case("simple route", ({match}) => {
    match("/user", /^\/user$/u);
  });
  test.case("param match/fail", ({match, fail}) => {
    const re = /^\/users\/(?<userId>[^/]{1,}?)a$/u;
    match("/users/1a", re);
    match("/users/aa", re);
    match("/users/ba?key=value", re);
    fail("/user/1a");
    fail("/users/a");
    fail("/users/aA");
    fail("/users//a");
    fail("/users/?a", "/users");
  });
  test.case("no params", ({path}) => {
    path("/", {});
  });
  test.case("single param", ({path}) => {
    path("/users/1a", {userId: "1"});
  });
  test.case("params", ({path, fail}) => {
    path("/users/1/comments/2", {userId: "1", commentId: "2"});
    path("/users/1/comments/2/b", {userId: "1", commentId: "2"});
    fail("/users/d/comments/2/b");
    fail("/users/1/comments/d/b");
    fail("/users/d/comments/d/b");
  });
  test.case("single typed param", ({path, fail}) => {
    path("/comments/1", {commentId: "1"});
    fail("/comments/ ", "/comments");
    fail("/comments/1d");
  });
  test.case("mixed untyped and typed params", ({path, fail}) => {
    path("/users/1/comments/2/a", {userId: "1", commentId: "2"});
    fail("/users/d/comments/2/a");
  });
  test.case("single implicit typed param", ({path, fail}) => {
    path("/comments2/1", {_commentId: "1"});
    fail("/comments2/d");
  });
  test.case("mixed implicit and untyped params", ({path, fail}) => {
    path("/users2/1/2", {_userId: "1", commentId: "2"});
    fail("/users2/d/2");
    fail("/users2/d");
  });
  test.case("mixed implicit and explicit params", ({path, fail}) => {
    path("/users3/1/2", {_userId: "1", _commentId: "2"});
    fail("/users3/d/2");
    fail("/users3/1/d");
    fail("/users3");
  });
  test.case("implicit params", ({path, fail}) => {
    path("/users4/1/2", {_userId: "1", _commentId: "2"});
    fail("/users4/d/2");
    fail("/users4/1/d");
    fail("/users4");
  });
  test.case("fail not strictly true implicit params", ({fail}) => {
    fail("/users5/any");
  });
  test.case("different case params", ({path, fail}) => {
    path("/uuid/Uuid/UUID", {uuid: "uuid", Uuid: "Uuid", UUID: "UUID"});
    fail("/uuid/uuid/uuid");
    fail("/Uuid/UUID/uuid");
    fail("/UUID/uuid/Uuid");
  });
};
