const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const docs = require('./authentication.docs');

module.exports = (app) => {
	const authentication = new AuthenticationService(app);

	authentication.register('jwt', new JWTStrategy());
	authentication.register('local', new LocalStrategy());
	authentication.docs = docs;

	app.use('/authentication', authentication);
	app.service('authentication');
	app.configure(expressOauth());
};
