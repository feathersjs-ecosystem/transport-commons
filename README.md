# @feathersjs/transport-commons

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/transport-commons.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/transport-commons.png?branch=master)](https://travis-ci.org/feathersjs/transport-commons)
[![Maintainability](https://api.codeclimate.com/v1/badges/87c506753cb9fc6a8b87/maintainability)](https://codeclimate.com/github/feathersjs/transport-commons/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/87c506753cb9fc6a8b87/test_coverage)](https://codeclimate.com/github/feathersjs/transport-commons/test_coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/transport-commons.svg?style=flat-square)](https://david-dm.org/feathersjs/transport-commons)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs/transport-commons.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs/transport-commons)

> Shared functionality for Feathers API transports like [@feathers/socketio](https://github.com/feathersjs/socketio) and [@feathersjs/primus](https://github.com/feathersjs/primus). Only intended to be used internally.

## About

`@feathersjs/transport-commons` contains internal shared functionality for Feathers real-time providers (currently Socket.io and Primus).

`lib/client.js` is a base socket service client
`lib/index.js` returns a configurable function and requires the following options:

- `done` - A Promise that resolves once the real-time protocol server has been set up
- `emit` - The name of the method to emit data to a socket (`'emit'` for Socket.io and `'send'` for Primus)
- `socketKey` - A string or ES6 Symbol which stores the actual socket connection
- `getParams` - A function that returns the Feathers connection options for a socket

## Channels

Channels provide channel functionality for bi-directional Feathers service providers. It is e.g. used by the Socket.io and Primus provider to quickly determine what messages to send to connected clients.

```
const channels = require('@feathersjs/transport-commons/lib/channels');
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
