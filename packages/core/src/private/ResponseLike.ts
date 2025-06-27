import type ResponseFunction from "#ResponseFunction";
import type Dictionary from "@rcompat/type/Dictionary";
import type MaybePromise from "@rcompat/type/MaybePromise";

type ResponseLike = MaybePromise<
  string |
  Dictionary |
  URL |
  ReadableStream |
  Blob |
  Response |
  ResponseFunction>;

export { ResponseLike as default };
