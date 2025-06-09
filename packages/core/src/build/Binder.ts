import type Context from "#build/BindingContext";
import type FileRef from "@rcompat/fs/FileRef";
import type MaybePromise from "@rcompat/type/MaybePromise";

type Binder = (file: FileRef, context: Context) => MaybePromise<void>;

export type { Binder as default };
