import type Session from "#session/Session";
import AsyncLocalStorage from "@rcompat/async/context";

class Cache {
  #entries: Record<symbol, unknown> = {};

  get<Data>(key: symbol, init: () => Data) {
    if (this.#entries[key] === undefined) {
      this.#entries[key] = init();
    }
    return this.#entries[key] as Data;
  }
}

const cache = new Cache();
const s = Symbol("primate.session");

export default <Data>() =>
  cache.get(s, () => new AsyncLocalStorage<Session<string, Data>>);
