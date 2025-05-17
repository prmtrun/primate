import RecordType from "#RecordType";
import type RecordTypeKey from "#RecordTypeKey";
import type Validated from "#Validated";

export default <
  const Key extends RecordTypeKey,
  const Value extends Validated<unknown>,
>(k: Key, v: Value) => new RecordType(k, v);
