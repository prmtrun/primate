import ConstructorType from "#ConstructorType";
import type AbstractConstructor from "@rcompat/type/AbstractConstructor";

export default <const C extends AbstractConstructor>(constructor: C) =>
  new ConstructorType(constructor);
