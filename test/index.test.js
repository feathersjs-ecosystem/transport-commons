const assert = require('assert');
const { EventEmitter } = require('events');
const feathers = require('feathers');

const commons = require('../lib');

describe.only('feathers-socket-commons', () => {
  let provider, options, app, connection;

  beforeEach(() => {
    connection = { testing: true };
    provider = new EventEmitter();

    options = {
      emit: 'emit',
      done: Promise.resolve(provider),
      socketKey: 'test',
      getParams () {
        return connection;
      }
    };
    app = feathers()
      .configure(commons(options))
      .use('/myservice', {
        get(id, params) {
          return Promise.resolve({ id, params });
        },

        create(data) {
          return Promise.resolve(data);
        }
      });

    return options.done;
  });

  it('`connection` event', done => {
    const socket = new EventEmitter();

    app.once('connection', data => {
      assert.equal(connection, data);
      done();
    });

    provider.emit('connection', socket);
  });

  describe('method name based socket events', () => {
    it('.get without params', done => {
      const socket = new EventEmitter();

      provider.emit('connection', socket);

      socket.emit('get', 'myservice', 10, (error, result) => {
        console.log(error, result);
        done();
      });
    });
  });
});
