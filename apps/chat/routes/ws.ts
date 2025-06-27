import uint from "pema/uint";
import ws from "primate/handler/ws";
import route from "primate/route";

export default route({
  get(request) {
    const limit = uint.default(20).validate(+request.query.limit);

    let n = 1;
    return ws({
      open() {
        console.log("opened!");
      },
      message(socket, message) {
        if (n > 0 && n < limit) {
          n++;
          socket.send(`You wrote ${message}`);
        }
      },
    });
  },
});
