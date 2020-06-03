// Initializes the `rooms` service on path `/rooms`
const { Rooms } = require('./rooms.class');
const createModel = require('../../models/rooms.model');
const hooks = require('./rooms.hooks');
const docs = require('./rooms.docs');

module.exports = function(app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
	};

	// Initialize our service with any options it requires
	const roomService = new Rooms(options, app);
	roomService.docs = docs;
	app.use('/rooms', roomService);

	// Get our initialized service so that we can register hooks
	const service = app.service('rooms');

	service.hooks(hooks);
};
