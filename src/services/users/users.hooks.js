const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const search = require('feathers-mongodb-fuzzy-search');

const {
	isVerified,
	addVerification,
	removeVerification,
} = require('feathers-authentication-management').hooks;
const commonHooks = require('feathers-hooks-common');

const populateField = require('../../hooks/populate-fields.js');
const authManagementService = require('../authmanagement/authmanagement.notifier');

const sendVerificationEmail = () => {
	return async (context) => {
		const { app, params, result } = context;
		if (!params.provider) return context;
		const user = result;

		if (process.env.GMAIL_ACCOUNT && user) {
			authManagementService(app).notifier('resendVerifySignup', user);
		}
		return context;
	};
};

module.exports = {
	before: {
		all: [ search([ 'name', 'email' ]), populateField({ fields: [ 'rooms' ] }) ],
		find: [ authenticate('jwt') ],
		get: [ authenticate('jwt') ],
		create: [ hashPassword('password'), addVerification() ],
		update: [ commonHooks.disallow('external') ],
		patch: [
			commonHooks.iff(
				commonHooks.isProvider('external'),
				commonHooks.preventChanges(
					true,
					'email',
					'isVerified',
					'verifyToken',
					'verifyShortToken',
					'verifyExpires',
					'verifyChanges',
					'resetToken',
					'resetShortToken',
					'resetExpires'
				),
				hashPassword('password'),
				authenticate('jwt')
			),
		],
		remove: [ authenticate('jwt') ],
	},

	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect('password'),
		],
		find: [],
		get: [],
		create: [ sendVerificationEmail(), removeVerification() ],
		update: [],
		patch: [],
		remove: [],
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},
};
