// Initializes the `auth-manager` service on path `/auth-manager`
const { AuthManager } = require('./auth-manager.class');
const hooks = require('./auth-manager.hooks');
const notifier = require('./auth-manager.notifier');

module.exports = function(app) {
	const options = {
		path: 'auth-manager',
		notifier,
	};

	app.configure(AuthManager(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('auth-manager');
	service.hooks(hooks);
};
