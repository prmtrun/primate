import BuiltinType from "#BuiltinType";
import type Storeable from "#Storeable";

export default class DateType
  extends BuiltinType<Date, "DateType">
  implements Storeable<"datetime"> {

  constructor() {
    super("date", Date);
  }

  get datatype() {
    return "datetime" as const;
  }

  normalize(value: Date) {
    return value;
  }
}
