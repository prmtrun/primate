import maybe from "@rcompat/assert/maybe";
import type { MarkedExtension } from "marked";
import { marked } from "marked";

const compile = (text: string) => `export default () => ${JSON.stringify(text)};`;

export default (options?: MarkedExtension) => async (text: string) => {
  maybe(options).object();

  const renderer = { ...options?.renderer ?? {} };
  marked.use({ ...options, renderer });

  return compile(await marked.parse(text));
};
