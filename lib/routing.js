const Router = require('radix-router');
const { stripSlashes } = require('@feathersjs/commons');

module.exports = function () {
  return app => {
    const router = new Router();

    Object.assign(app, {
      lookup (path) {
        return router.lookup(stripSlashes(path));
      }
    });

    // Add a mixin that registers a service on the router
    app.mixins.push((service, path) => {
      router.insert({ path, service });
      router.insert({
        path: `${path}/:__id`,
        service
      });
    });
  };
};
