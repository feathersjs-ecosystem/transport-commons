import assert from 'assert';
import plugin from '../src';

if (!global._babelPolyfill) { require('babel-polyfill'); }

describe('feathers-socket-commons', () => {
  it('is CommonJS compatible', () => {
    assert.equal(typeof require('../lib'), 'function');
  });

  it('basic functionality', done => {
    assert.equal(typeof plugin, 'function', 'It worked');
    done();
  });
});
