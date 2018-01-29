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
        const [ basePath ] = args;
        const result = this._super(...args);

        if (typeof basePath === 'string' && this.service(basePath)) {
          const service = this.service(basePath);
          const path = stripSlashes(args[0]);

          router.insert({ path, service });
          router.insert({
            path: `${path}/:__id`,
            service
          });
        }

        return result;
      }
    }, app);
  };
};
