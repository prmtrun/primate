import view from "primate/view";
import route from "primate/route";

const posts = [{
  id: 1,
  title: "First post",
}];

export default route({
  get() {
    return view("index.poly", { posts });
  },
});
