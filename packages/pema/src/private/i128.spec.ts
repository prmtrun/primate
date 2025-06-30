import spec from "#spec/bigint";
import i128 from "#i128";

spec(i128, -(2n ** 127n), 2n ** 127n - 1n);
