const Proto = require('uberproto');
const Router = require('radix-router');
const { stripSlashes } = require('@feathersjs/commons');

module.exports = function () {
  return app => {
    Proto.mixin({
      router: new Router(),
      lookup (path) {
        return this.router.lookup(stripSlashes(path));
      },
      use (...args) {
        this._super(...args);

        const path = stripSlashes(args[0]);
        const service = this.service(path);

        this.router.insert({ path, service });
        this.router.insert({
          path: `${path}/:__id`,
          service
        });

        return this;
      }
    }, app);
  };
};
