import InstanceType from "#InstanceType";

export default class DateType extends InstanceType<Date, "DateType"> {
  constructor() {
    super("date", Date);
  }
}
