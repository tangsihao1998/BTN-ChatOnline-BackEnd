const { authenticate } = require('@feathersjs/authentication').hooks;

const populateField = require('../../hooks/populate-fields.js');

const setTimestamp = (name) => {
	return async (context) => {
		context.data[name] = new Date();
		return context;
	};
};

const appendSenderId = () => {
	return async (context) => {
		// The logged in user
		const { user } = context.params;

		// Append user's id to message object as 'senderId'
		context.data.sender = user._id;

		return context;
	};
};

const addMessageToRoom = () => {
	return async (context) => {
		// Get `app`, `method`, `params` and `result` from the hook context
		const { app, result, params } = context;

		// Get id of room in which message was posted
		const roomId = result.inRoom;

		// Push message to room
		await app.service('rooms').patch(roomId, { $push: { messages: result._id } }, params);
	};
};

const removeSensitiveData = () => {
	return async (context) => {
		const { result, method } = context;

		const _removeSensitiveData = (message) => {
			delete message.sender.password;
			return message;
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
		all: [ authenticate('jwt'), populateField({ fields: [ 'sender' ] }) ],
		find: [],
		get: [],
		create: [ setTimestamp('createdAt'), appendSenderId() ],
		update: [ setTimestamp('updatedAt') ],
		patch: [],
		remove: [],
	},

	after: {
		all: [ removeSensitiveData() ],
		find: [],
		get: [],
		create: [ addMessageToRoom() ],
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
