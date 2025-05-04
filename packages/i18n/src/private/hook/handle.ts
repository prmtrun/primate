import header from "#header";
import type Manager from "#Manager";
import modulename from "#name";
import type { RequestHook } from "@primate/core/hook";
import Status from "@rcompat/http/Status";

type CookieOptions = {
  [key in "path" | "secure" | "httpOnly" | "sameSite"]: string
};
type Cookie = (
  name: string,
  value: string,
  { path, secure, httpOnly, sameSite }: CookieOptions
) => string;

const cookie: Cookie = (name, value, { path, secure, httpOnly, sameSite }) =>
  `${name}=${value};${httpOnly};Path=${path};${secure};SameSite=${sameSite}`;

const options = {
  sameSite: "Strict" ,
  path: "/",
  httpOnly: "HttpOnly",
  secure: "Secure",
};

export default (manager: Manager): RequestHook => (request, next) => {
  if (!manager.active) {
    return next(request);
  }

  const set_locale = request.headers[header.toLowerCase()];

  if (set_locale === undefined) {
    return next(request);
  }

  return new Response(null, {
    status: Status.OK,
    headers: {
      "set-cookie": cookie(modulename, set_locale, options),
    },
  });
};
