import spec from "#spec/bigint";
import i64 from "#i64";

spec(i64, -(2n ** 63n), 2n ** 63n - 1n);
