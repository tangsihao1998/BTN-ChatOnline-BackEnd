module.exports = {
	description: 'A service that provides an interface to interact with the `messages` model',
	securities: 'all',
	schemas: {
		messages: {
			type: 'object',
			required: [ 'content', 'type', 'sender', 'inRoom' ],
			properties: {
				content: {
					type: 'string',
					description: 'Content of message',
				},
				type: {
					type: 'string',
					default: 'text',
					description: 'Type of message (text, image etc.)',
				},
				sender: {
					type: 'string',
					format: 'ObjectId',
					description: 'Id of the user that sent the message',
					$ref: '#/components/schemas/users',
				},
				inRoom: {
					type: 'string',
					format: 'ObjectId',
					description: 'Id of the room that the message was sent in',
				},
			},
		},
		messages_list: {
			type: 'array',
			items: {
				$ref: '#/components/schemas/messages',
			},
		},
	},
	operations: {
		find: {
			description: 'Retrieve all messages.',
		},
		get: {
			description: 'Retrieve a single message specified by _id.',
		},
		create: {
			description:
				'Create a new message.<br>' +
				'Automatically fills senderId with user._id.<br>' +
				'Also add message._id to room.',
		},
		update: {
			description: 'Update a message by completely replacing it with a new object.',
		},
		patch: {
			description: 'Update one or more messages by merging them with a new object.',
		},
		remove: {
			description: 'Delete a single message specified by _id.',
		},
		multi: [ 'remove' ],
	},
};
