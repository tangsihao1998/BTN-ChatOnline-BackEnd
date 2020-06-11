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

const removeCircularFields = () => {
	return async (context) => {
		const { method, result } = context;

		if (!result) return context;

		const _removeCircularFields = (user) => {
			if (user.friends) {
				user.friends.forEach((friend) => {
					delete friend.friends;
				});
			}

			if (user.rooms) {
				user.rooms.forEach((room) => {
					delete room.members;
					delete room.messages;
				});

				return user;
			}
		};

		if (method === 'find') {
			// Map all data to remove circular JSON formations
			context.result.data = result.data.map(_removeCircularFields);
		} else {
			// Otherwise just update the single result
			context.result = _removeCircularFields(result);
		}
	};
};

module.exports = {
	before: {
		all: [ search({ fields: [ 'name', 'email' ] }), populateField({ fields: [ 'rooms' ] }) ],
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
			removeCircularFields(),
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
