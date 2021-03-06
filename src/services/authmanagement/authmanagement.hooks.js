const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');

const isAction = (...args) => {
	return async (context) => args.includes(context.data.action);
};

module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [ commonHooks.iff(isAction('passwordChange', 'identityChange'), authenticate('jwt')) ],
		update: [],
		patch: [],
		remove: [],
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
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
