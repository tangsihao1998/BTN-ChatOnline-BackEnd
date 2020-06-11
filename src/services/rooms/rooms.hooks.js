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
		//   then push current user's id into it.
		if (!context.data.members) context.data.members = [];
		// Note: only push if the id does not already exist
		if (context.data.members.indexOf(user._id) === -1) context.data.members.push(user._id);

		return context;
	};
};

const addRoomToUserObject = () => {
	return async (context) => {
		// Get the logged in user, `app`, `params` and `results` from the hook context
		const { app, params, result } = context;
		const { user } = params;

		// Push room to rooms array in user object (in database)
		//   ($addToSet prevents adding duplicate roomId if one already exists)
		await app.service('users').patch(user._id, { $addToSet: { rooms: result._id } }, params);
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

const cascadeDelete = () => {
	return async (context) => {
		const { app, params, id } = context;
		// When deleting a room, we also need to delete its references in users.rooms and messages.inRoom
		await Promise.all([
			app.service('users').patch(
				null,
				{
					$pull: {
						rooms: id,
					},
				},
				{
					query: {
						rooms: {
							_id: id,
						},
					},
				}
			),

			app.service('messages').remove(null, {
				query: {
					inRoom: id,
				},
				...params,
			}),
		]);
	};
};

const removeCircularFields = () => {
	return async (context) => {
		const { method, result } = context;

		if (!result) return context;

		const _removeCircularFields = (room) => {
			if (room.members) {
				room.members.forEach((member) => {
					delete member.rooms;
				});
			}

			return room;
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
		all: [ authenticate('jwt') ],
		find: [ populateField({ fields: [ 'members', 'messages' ] }) ],
		get: [ populateField({ fields: [ 'members', 'messages' ] }) ],
		create: [ setTimestamp('createdAt'), addCurrentUserToMemberList() ],
		update: [ setTimestamp('updatedAt'), populateField({ fields: [ 'members', 'messages' ] }) ],
		patch: [ populateField({ fields: [ 'members', 'messages' ] }) ],
		remove: [],
	},

	after: {
		all: [ removeSensitiveData(), removeCircularFields() ],
		find: [],
		get: [],
		create: [ addRoomToUserObject() ],
		update: [],
		patch: [],
		remove: [ cascadeDelete() ],
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
