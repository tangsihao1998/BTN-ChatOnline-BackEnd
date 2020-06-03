const { authenticate } = require('@feathersjs/authentication').hooks;

const populateField = require('../../hooks/populate-fields.js');

const setTimestamp = (name) => {
	return async (context) => {
		context.data[name] = new Date();
		return context;
	};
};

const addCurrentUserToMemberList = () => {
	return async (context) => {
		// The logged in user
		const { user } = context.params;

		// Create an empty members array if not already provided
		// then push current user's id into it.
		if (!context.data.members) context.data.members = [];
		context.data.members.push(user._id);

		return context;
	};
};

const removeSensitiveData = () => {
	return async (context) => {
		const { result, method } = context;

		const _removeSensitiveData = (room) => {
			room.members.forEach((member) => {
				delete member.password;
			});

			return room;
		};

		if (method === 'find') {
			// Map all data to include the `user` information
			context.result.data = result.data.map(_removeSensitiveData);
		} else {
			// Otherwise just update the single result
			context.result = _removeSensitiveData(result);
		}

		return context;
	};
};

module.exports = {
	before: {
		all: [ authenticate('jwt'), populateField({ fields: [ 'members', 'messages' ] }) ],
		find: [],
		get: [],
		create: [ setTimestamp('createdAt'), addCurrentUserToMemberList() ],
		update: [ setTimestamp('updatedAt') ],
		patch: [],
		remove: [],
	},

	after: {
		all: [ removeSensitiveData() ],
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
