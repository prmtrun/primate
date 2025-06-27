import assert from "@rcompat/assert";
import route from "primate/route";
import view from "primate/view";

const posts = [{
  id: 1,
  title: "First post",
}];

const get_post = (id: string) => posts.find(post => post.id === +id);

export default route({
  get(request) {
    const post = get_post(request.path.id!);
    assert(post !== undefined);

    return view("post-view.svelte", { post });
  },
});
