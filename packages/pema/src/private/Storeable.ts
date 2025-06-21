import Validated from "#Validated";
import type DataType from "#DataType";
import type Infer from "#Infer";

export default abstract class Storeable<T extends keyof DataType = any>
  extends Validated<unknown> {
  abstract get datatype(): T;

  abstract normalize(value: Infer<this>): DataType[T];
}
