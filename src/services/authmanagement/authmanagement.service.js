// Initializes the `auth-manager` service on path `/auth-manager`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./authmanagement.notifier');

module.exports = function(app) {
	// Initialize our service with any options it requires
	app.configure(authManagement(notifier(app)));

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('authManagement');

	service.hooks(hooks);
};
