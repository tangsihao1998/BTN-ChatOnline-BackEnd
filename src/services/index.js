const users = require('./users/users.service');
const rooms = require('./rooms/rooms.service');
const messages = require('./messages/messages.service');
const authentication = require('./authentication/authentication.service');
const email = require('./email/email.service.js');
// const authManager = require('./auth-manager/auth-manager.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
	app.configure(authentication);
	app.configure(users);
	app.configure(rooms);
	app.configure(messages);
	app.configure(email);
	// app.configure(authManager);
};
