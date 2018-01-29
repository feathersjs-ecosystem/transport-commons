const Proto = require('uberproto');
const Router = require('radix-router');
const { stripSlashes } = require('@feathersjs/commons');

module.exports = function () {
  return app => {
    const router = new Router();

    Proto.mixin({
      lookup (path) {
        return router.lookup(stripSlashes(path));
      },
      use (...args) {
        this._super(...args);

        const path = stripSlashes(args[0]);
        const service = this.service(path);

        router.insert({ path, service });
        router.insert({
          path: `${path}/:__id`,
          service
        });

        return this;
      }
    }, app);
  };
};
