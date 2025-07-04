# Marko

This module serves Marko components using the `.marko` extension.

## Install

`npm install @primate/marko`

## Configure

Import and initialize the module in your configuration.

```js caption=primate.config.js
import marko from "@primate/marko";

export default {
  modules: [
    marko(),
  ],
};
```

## Use

Create a Marko component in `components`.

```marko caption=components/post-index.marko
<h1>All posts</h1>
<for|post| of=input.posts>
  <h2>
    <a href="/post/view/${post.id}">
      ${post.title}
    </a>
  </h2>
</for>
```

Serve it from a route.

```js caption=routes/marko.js
import view from "primate/view";

const posts = [{
  id: 1,
  title: "First post",
}];

export default {
  get() {
    return view("post-index.marko", { posts });
  },
};
```

The rendered component will be accessible at http://localhost:6161/marko.

## Configuration options

### extension

Default `".marko"`

The file extension associated with Marko components.

## Resources

* [Repository][repo]

[repo]: https://github.com/primate-run/primate/tree/master/packages/marko
