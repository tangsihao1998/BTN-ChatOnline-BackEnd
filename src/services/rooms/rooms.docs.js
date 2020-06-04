module.exports = {
	description: 'A service that provides an interface to interact with the `rooms` model',
	securities: 'all',
	schemas: {
		rooms: {
			type: 'object',
			required: [ 'name', 'type' ],
			properties: {
				name: {
					type: 'string',
					description: 'Name of the room',
				},
				type: {
					type: 'string',
					default: 'text',
					description: 'Type of room (direct, group etc.)',
				},
				members: {
					type: 'array',
					items: {
						$ref: '#/components/schemas/users',
					},
					description: 'List of members in room',
				},
				messages: {
					type: 'array',
					items: {
						$ref: '#/components/schemas/messages',
					},
					description: 'List of messages in room',
				},
			},
		},
		rooms_list: {
			type: 'array',
			items: {
				$ref: '#/components/schemas/rooms',
			},
		},
	},
	operations: {
		find: {
			description: 'Retrieve all rooms.',
		},
		get: {
			description: 'Retrieve a single room specified by _id.',
		},
		create: {
			description:
				'Create a new room.<br>' +
				'Adds current user to newRoom.members.<br>' +
				'Add newRoom._id to user.rooms.',
		},
		update: {
			description: 'Update a room by completely replacing it with a new object.',
		},
		patch: {
			description: 'Update one or more rooms by merging them with a new object.',
		},
		remove: {
			description:
				'Delete a single room specified by _id.<br>' +
				'Also delete all messages in that room and remove room._id from user.rooms.',
		},
	},
};
