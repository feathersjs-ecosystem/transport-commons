const errors = require('feathers-errors');
const debug = require('debug')('feathers-socket-commons');

const paramsPositions = exports.paramsPositions = {
  find: 0,
  get: 1,
  remove: 1,
  create: 1,
  update: 2,
  patch: 2
};

const normalizeError = exports.normalizeError = function (e) {
  const hasToJSON = typeof e.toJSON === 'function';
  const result = hasToJSON ? e.toJSON() : {};

  if (!hasToJSON) {
    Object.getOwnPropertyNames(e).forEach(key => {
      result[key] = e[key];
    });
  }

  if (process.env.NODE_ENV === 'production') {
    delete result.stack;
  }

  delete result.hook;

  return result;
};

exports.getDispatcher = function (emit, socketKey) {
  return function (event, channel, hook) {
    debug(`Dispatching '${event}' to ${channel.length} connections`);

    channel.connections.forEach(connection => {
      // The reference between connection and socket
      // is set in `app.setup`
      const socket = connection[socketKey];

      if (socket) {
        const data = channel.dataFor(connection) || hook.dispatch || hook.result;
        const eventName = `${hook.path || ''} ${event}`.trim();

        debug(`Dispatching '${eventName}' to Socket ${socket.id} with`, data);

        socket[emit](eventName, data);
      }
    });
  };
};

exports.runMethod = function (app, connection, path, method, args) {
  const trace = `method '${method}' on service '${path}'`;

  debug(`About to run ${trace}`, connection, args);

  if (paramsPositions[method] === undefined) {
    return Promise.reject(new errors.MethodNotAllowed(`${method} is an invalid service method name`, Object.keys(paramsPositions)));
  }

  const service = app.service(path);
  const position = paramsPositions[method];
  const methodArgs = args.slice(0);
  const callback = methodArgs.pop();
  const params = Object.assign({
    query: methodArgs[position] || {}
  }, connection);

  methodArgs[position] = params;

  service[method](...methodArgs)
    .then(result => {
      debug(`Returned successfully ${trace}`, result);
      callback(null, result);
    })
    .catch(e => {
      debug(`Error in ${trace}`, e);
      callback(normalizeError(e));
    });
};
