import spec from "#spec/int";
import i32 from "#i32";

spec(i32, -(2 ** 31), 2 ** 31 - 1);
