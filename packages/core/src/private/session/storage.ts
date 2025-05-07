import AsyncLocalStorage from "@rcompat/async/context";
import type Session from "#session/Session";
import type Data from "#session/Data";

export default new AsyncLocalStorage<Session<string, Data>>();
