import type Props from "@primate/core/frontend/Props";
import type ServerComponent from "@primate/core/frontend/ServerComponent";
import runtime from "handlebars/runtime.js";

export default (component: ServerComponent, props: Props) =>
  (runtime as any).template(component)(props);
