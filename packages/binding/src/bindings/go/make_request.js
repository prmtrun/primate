import { from, stringify } from "rcompat/object";

const make_search_params = url => stringify(from(url.searchParams.entries()));
const dispatchables = ["body", "path", "query", "cookies", "headers"];

export default request => {
  return {
    url: request.url,
    search_params: make_search_params(request.url),
    ...from(dispatchables.map(property => [
      property, {
        properties: request[property].get(),
        ...request[property],
        getAge() {
          try {
            return request[property].getAge();
          } catch ({ message }) {
            return () => message;
          }
        },
      },
    ])),
  };
};
