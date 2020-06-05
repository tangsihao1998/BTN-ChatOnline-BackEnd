const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const {
	isVerified,
	addVerification,
	removeVerification,
} = require('feathers-authentication-management').hooks;
const commonHooks = require('feathers-hooks-common');

const populateField = require('../../hooks/populate-fields.js');

// const preventUnverifiedChanges = () => {
// 	return commonHooks.iff(
// 		commonHooks.isProvider('external'),
// 		commonHooks.preventChanges(
// 			'email',
// 			'isVerified',
// 			'verifyToken',
// 			'verifyShortToken',
// 			'verifyExpires',
// 			'verifyChanges',
// 			'resetToken',
// 			'resetShortToken',
// 			'resetExpires'
// 		)
// 	);
// };

const sendVerificationEmail = () => {
	return async (context) => {
		const { app, params, result } = context;
		if (!params.provider) return context;
		const user = result;

		if (process.env.GMAIL_ACCOUNT && user) {
			app.service('auth-manager').notifier('resendVerifySignup', user);
		}
		return context;
	};
};

module.exports = {
	before: {
		all: [ populateField({ fields: [ 'rooms' ] }) ],
		find: [ authenticate('jwt') ],
		get: [ authenticate('jwt') ],
		create: [ hashPassword('password'), addVerification('auth-manager') ],
		update: [ hashPassword('password'), authenticate('jwt') ],
		patch: [ hashPassword('password'), authenticate('jwt') ],
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
		update: [ commonHooks.disallow('external') ],
		patch: [ isVerified /*preventUnverifiedChanges()*/ ],
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
