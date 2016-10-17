import assert from 'assert';
import { convertFilterData, promisify, normalizeError } from '../src/utils';

describe('utils', () => {
  it('convertFilterData', () => {
    const fn = function() {};

    assert.deepEqual(convertFilterData(fn), {
      all: [fn]
    });

    assert.deepEqual(convertFilterData({
      test: fn
    }), {
      test: [fn]
    });

    assert.deepEqual(convertFilterData({
      testing: [fn, fn]
    }), {
      testing: [fn, fn]
    });
  });

  it('promisify', done => {
    const context = {};
    const message = 'a can not be null';
    const fn = function(a, b, callback) {
      assert.equal(this, context);
      if(a === null) {
        return callback(new Error(message));
      }
      callback(null, a + b);
    };

    promisify(fn, context, 1, 2).then(result => {
      assert.equal(result, 3);
      promisify(fn, context, null, null).catch(error => {
        assert.equal(error.message, message);
        done();
      });
    });
  });

  it('normalizeError', () => {
    const e = new Error('Testing');
    e.hook = 'test';
    e.expando = true;

    const obj = normalizeError(e);

    assert.ok(typeof obj === 'object');
    assert.ok(!(obj instanceof Error));
    assert.ok(typeof obj.hook === 'undefined');
    assert.equal(obj.message, 'Testing');
    assert.equal(obj.expando, true);
  });
});
