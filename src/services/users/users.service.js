// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');
const docs = require('./users.docs');

module.exports = function(app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
		multi: [ 'patch' ],
	};

	// Initialize our service with any options it requires
	const userService = new Users(options, app);
	userService.docs = docs;
	app.use('/users', userService);

	// Get our initialized service so that we can register hooks
	const service = app.service('users');

	service.hooks(hooks);
};
