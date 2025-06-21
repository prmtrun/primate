import is_int from "#is-int";

export default (n: unknown): n is number | bigint => is_int(n) && n > 0;
