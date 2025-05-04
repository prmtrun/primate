import context_name from "#context-name";
import locale_store from "#i18n/locale";
import type Context from "#i18n/Context";
import resolve from "@primate/i18n/resolve";
import type Dictionary from "@rcompat/type/Dictionary";
import { getContext } from "poly";
import { derived } from "poly/store";

export default derived(locale_store, locale =>
  (key: string, placeholders: Dictionary<string>) => {
  const { locales } = getContext<Context>(context_name).i18n;
  return resolve(locales[locale], key, placeholders);
});
