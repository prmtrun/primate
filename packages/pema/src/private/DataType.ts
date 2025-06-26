//import type EO from "@rcompat/type/EO";
import type Id from "#Id";

type DataType = {
  id: Id;
  //array: unknown[];
  blob: Blob;
  boolean: boolean;
  datetime: Date;
  //document: EO;
  f32: number;
  f64: number;
  i8: number;
  i16: number;
  i32: number;
  i64: bigint;
  //json: EO;
  string: string;
  time: Date;
  u8: number;
  u16: number;
  u32: number;
  u64: bigint;
};

export type { DataType as default };
