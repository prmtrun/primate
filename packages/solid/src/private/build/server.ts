import { transformAsync } from "@babel/core";
// @ts-expect-error no declaration file
import solid from "babel-preset-solid";

export default async (text: string) => {
  const presets = [[solid, { generate: "ssr", hydratable: true }]];
  return (await transformAsync(text, { presets }))?.code ?? "";
};

