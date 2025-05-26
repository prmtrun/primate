import store from "#db/store";
import test from "@rcompat/test";
import number from "pema/number";
import string from "pema/string";
import optional from "pema/optional";

const Post = store({
  id: number,
  title: string,
  user_id: number,
});

const User = store({
  id: number,
  name: string.default("Donald"),
  lastname: optional(string),
  age: number,
  //post_id: Post.schema.id,
  //post: Post.one({ post_id: post => post.id }),
  //posts: Post.many({ id: post => post.user_id }),
});

test.case("update", async (assert) => {
  const r = await User.update({ id: 1 }, { lastname: "John" });
  assert(r).type<{
    lastname?: string | undefined;
    id: number;
    name: string;
    age: number;
  }>();
});

test.case("query", async (assert) => {
  const r = await User.query().select("lastname", "name").run();
  assert(r).type<{ name: string; lastname?: string }>();
});

test.case("find", async (assert) => {
  const _ = await User.find({ name: "string" });
  assert(_).type<
    {
      id: number;
      name: string;
      lastname?: string;
      age: number;
    }[]
  >();

  const users = await User.find(
    { name: "string" },
    { name: true, lastname: true },
  );
  assert(users).type<
    {
      name: string;
      lastname?: string;
    }[]
  >();

  const users2 = await User.find({ name: "string" }, { age: true });
  assert(users2).type<
    {
      age: number;
    }[]
  >();

  const users3 = await User.find(
    { name: "string" },
    {
      age: true,
      lastname: true,
    },
  );
  assert(users3).type<
    {
      age: number;
      lastname?: string;
    }[]
  >();
});
