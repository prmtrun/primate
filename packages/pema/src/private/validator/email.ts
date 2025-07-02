import regex from "#validator/regex";

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export default regex(email, x => `"${x}" is not a valid email`);
