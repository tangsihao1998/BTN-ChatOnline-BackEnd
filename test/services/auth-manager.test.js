const assert = require('assert');
const app = require('../../src/app');

describe('\'auth-manager\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth-manager');

    assert.ok(service, 'Registered the service');
  });
});
