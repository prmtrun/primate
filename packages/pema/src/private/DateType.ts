import BuiltinType from "#BuiltinType";

export default class DateType extends BuiltinType<Date, "DateType"> {
  constructor() {
    super("date", Date);
  }
}
