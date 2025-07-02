import regex from "#validator/regex";

const uuid = /^[^\W_]{8}-[^\W_]{4}-[^\W_]{4}-[^\W_]{4}-[^\W_]{12}$/u;

export default regex(uuid, x => `"${x}" is not a valid UUID`);
