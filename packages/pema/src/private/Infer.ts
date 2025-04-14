import type Validated from "#Validated";

type Infer<T extends Validated<unknown>> = T["infer"];

export { Infer as default };
