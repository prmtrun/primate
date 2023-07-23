import driver from "./driver.js";
import base from "../base.test.js";

const client = async () => {
  const d = await driver({
    user: "test",
    pass: "test",
  })();
  return d;
};

export default test => base(test, client);
