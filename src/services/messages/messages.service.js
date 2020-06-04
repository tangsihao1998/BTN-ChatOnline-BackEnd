// Initializes the `messages` service on path `/messages`
const { Messages } = require('./messages.class');
const createModel = require('../../models/messages.model');
const hooks = require('./messages.hooks');
const docs = require('./messages.docs');

module.exports = function(app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
		multi: [ 'remove' ],
	};

	// Initialize our service with any options it requires
	const messageService = new Messages(options, app);
	messageService.docs = docs;
	app.use('/messages', messageService);

	// Get our initialized service so that we can register hooks
	const service = app.service('messages');

	service.hooks(hooks);
};
