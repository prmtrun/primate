import errors from "#errors";
import map from "@rcompat/async/map";
import assert from "@rcompat/invariant/assert";
import Connection from "@rcompat/sql/sqlite";

const defaults: {
  poolsize: number;
  timeout: number;
  waitfor: number;
} = {
  // Pool size
  poolsize: 4,
  // timeout, in ms
  timeout: 500,
  // connection reacquiring delay, in ms
  waitfor: 50,
};

const manager = {
  new: (database: string) => new Connection(database, { create: true }),
  destroy: (connection: Connection) => connection.close(),
};

export default class Client {
  #free: Connection[] = [];
  #used: Connection[] = [];
  #database: string;

  constructor(database: string) {
    this.#database = database;
  }

  get size() {
    return this.#free.length + this.#used.length;
  }

  get inflatable() {
    return defaults.poolsize - this.size > 0;
  }

  #inflate() {
    return this.inflatable ? manager.new(this.#database) : undefined;
  }

  get reusable() {
    return this.#free.length > 0;
  }

  #reuse() {
    return this.reusable ? this.#free.pop() : this.#inflate();
  }

  async #acquire() {
    const connection = await this.#reuse();

    if (connection !== undefined) {
      this.#used = [...this.#used, connection];
      return connection;
    }
  }

  #reacquire(timeout: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.acquire(timeout - defaults.waitfor));
      }, defaults.waitfor);
    });
  }

  async acquire(timeout = defaults.timeout) {
    assert(timeout >= 0, errors.TIMED_OUT);

    const connection = await this.#acquire();
    return connection === undefined
      ? this.#reacquire(timeout)
      : connection;
  }

  release(connection: Connection) {
    const i = this.#used.findIndex(used => used === connection);
    assert(i !== -1, errors.NOT_FOUND);

    this.#free = [...this.#free, this.#used.at(i)];
    this.#used = [...this.#used.slice(0, i), ...this.#used.slice(i + 1)];
  }

  async clear() {
    await map(this.#free, manager.destroy);
    this.#free = [];

    await map(this.#used, manager.destroy);
    this.#used = [];
  }
}
