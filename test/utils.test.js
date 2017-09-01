const assert = require('assert');
const { EventEmitter } = require('events');
const feathers = require('feathers');

const {
  normalizeError,
  getDispatcher,
  runMethod
} = require('../lib/utils');

describe('socket commons utils', () => {
  describe('.normalizeError', () => {
    it('simple error normalization', () => {
      const message = 'Something went wrong';
      const e = new Error(message);

      assert.deepEqual(normalizeError(e), {
        message,
        stack: e.stack.toString()
      });
    });

    it('calls .toJSON', () => {
      const json = { message: 'toJSON called' };

      assert.deepEqual(normalizeError({
        toJSON () {
          return json;
        }
      }), json);
    });

    it('removes `hook` property', () => {
      const e = {
        hook: true
      };

      assert.deepEqual(normalizeError(e), {});
      assert.ok(e.hook, 'Does not mutate the original object');
    });
  });

  describe('.getDispatcher', () => {
    it('returns a dispatcher function', () =>
      assert.equal(typeof getDispatcher(), 'function')
    );

    describe('dispatcher logic', () => {
      let dispatcher, dummySocket, dummyHook, dummyChannel;

      beforeEach(() => {
        dispatcher = getDispatcher('emit', 'test');
        dummySocket = new EventEmitter();
        dummyHook = { result: 'hi' };
        dummyChannel = {
          connections: [{
            test: dummySocket
          }],
          dataFor () {
            return null;
          }
        };
      });

      it('dispatches a basic event', done => {
        dummySocket.once('testing', data => {
          assert.equal(data, 'hi');
          done();
        });

        dispatcher('testing', dummyChannel, dummyHook);
      });

      it('dispatches event on a hooks path event', done => {
        dummyHook.path = 'myservice';

        dummySocket.once('myservice testing', data => {
          assert.equal(data, 'hi');
          done();
        });

        dispatcher('testing', dummyChannel, dummyHook);
      });

      it('dispatches `hook.dispatch` instead', done => {
        const message = 'hi from dispatch';

        dummyHook.dispatch = message;

        dummySocket.once('testing', data => {
          assert.equal(data, message);
          done();
        });

        dispatcher('testing', dummyChannel, dummyHook);
      });

      it('does nothing if there is no socket', () => {
        dummyChannel.connections[0].test = null;

        dispatcher('testing', dummyChannel, dummyHook);
      });
    });
  });

  describe('.runMethod', () => {
    let app;

    beforeEach(() => {
      app = feathers().use('/myservice', {
        get (id) {
          return Promise.resolve({ id });
        }
      });
    });

    it('simple method running', done => {
      const callback = (error, result) => {
        if (error) {
          return done(error);
        }

        assert.deepEqual(result, { id: 10 });
        done();
      };

      runMethod(app, {}, 'myservice', 'get', [ 10, callback ]);
    });
  });
});
