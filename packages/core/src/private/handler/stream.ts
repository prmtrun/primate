import handler from "#handler";
import stream from "@rcompat/fs/stream";
import type Streamable from "@rcompat/fs/Streamable";
import { bin } from "@rcompat/http/mime";

/**
 * Stream a response
 * @param body streamable body
 * @param options response options
 * @return Response rendering function
 */
export default handler<Streamable<unknown>>(bin, stream);
