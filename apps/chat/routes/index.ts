import view from "primate/handler/view";
import route from "primate/route";

export default route({
  get() {
    return view("index.html");
  },
});
