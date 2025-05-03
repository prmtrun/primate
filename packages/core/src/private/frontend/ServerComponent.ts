import type Props from "#frontend/Props";
import type MaybePromise from "@rcompat/type/MaybePromise";

type ServerComponent = (props: Props) => MaybePromise<string>;

export { ServerComponent as default };
