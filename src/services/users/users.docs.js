module.exports = {
	description: 'A service that provides an interface to interact with the `users` model',
	securities: [ 'find', 'get', 'update', 'patch', 'remove' ],
	schemas: {
		users: {
			type: 'object',
			required: [ 'email', 'password', 'role', 'inRoom' ],
			properties: {
				email: {
					type: 'string',
					format: 'email',
					unique: true,
					lowercase: true,
				},
				password: {
					type: 'string',
					format: 'password',
				},
				name: {
					type: 'string',
				},
				image: {
					type: 'string',
				},
				phone: {
					type: 'string',
				},
				role: {
					type: 'string',
					default: 'User',
				},
				rooms: {
					type: 'array',
					items: {
						$ref: '#/components/schemas/rooms',
					},
					description: 'List of rooms that user is currently in.',
				},
				createdAt: {
					type: 'string',
					format: 'date-time',
				},
				updatedAt: {
					type: 'string',
					format: 'date-time',
				},
			},
		},

		users_list: {
			type: 'array',
			items: {
				$ref: '#/components/schemas/users',
			},
		},
	},
	operations: {
		find: {
			description: 'Retrieve all users.',
			'responses.200.description': 'success',
			'responses.200.content': {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							total: {
								type: 'integer',
								description: 'Number of users retrieved.',
							},
							limit: {
								type: 'integer',
								description: 'Maximum number of users per page.',
							},
							skip: {
								type: 'integer',
								description: 'Number of users skipped.',
							},
							data: {
								type: 'array',
								description: 'Array of returned users.',
								items: {
									type: 'object',
									properties: {
										email: {
											type: 'string',
											format: 'email',
											unique: true,
											lowercase: true,
										},
										name: {
											type: 'string',
										},
										image: {
											type: 'string',
										},
										phone: {
											type: 'string',
										},
										role: {
											type: 'string',
											default: 'User',
										},
										rooms: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/rooms',
											},
											description: 'List of rooms that user is currently in.',
										},
										createdAt: {
											type: 'string',
											format: 'date-time',
										},
										updatedAt: {
											type: 'string',
											format: 'date-time',
										},
									},
								},
							},
						},
					},
					example: {
						total: 2,
						limit: 10,
						skip: 0,
						data: [
							{
								email: 'admin@domain.com',
								name: 'Admin 1',
								image: null,
								phone: null,
								role: 'Admin',
								rooms: [
									{
										name: 'Room 1',
										type: 'Direct',
										members: [ '1', '2' ],
										messages: [],
									},
								],
								createdAt: '2020-06-03T17:46:32.679Z',
								updatedAt: '2020-06-03T17:51:11.626Z',
							},
							{
								name: 'User 1',
								email: 'user@domain.com',
								image: null,
								phone: null,
								role: 'User',
								rooms: [
									{
										name: 'Room 2',
										type: 'DirectGroup',
										members: [ '1', '2', '3' ],
										messages: [
											{
												content: 'Hello all',
												type: 'text',
												sender: '1',
												inRoom: '2',
											},
										],
									},
								],
								createdAt: '2020-06-03T18:47:32.679Z',
								updatedAt: '2020-06-03T18:55:11.626Z',
							},
						],
					},
				},
			},
		},
		get: {
			description: 'Retrieve a single user specified by _id.',
			'responses.200.description': 'success',
			'responses.200.content': {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							items: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										unique: true,
										lowercase: true,
									},
									name: {
										type: 'string',
									},
									image: {
										type: 'string',
									},
									phone: {
										type: 'string',
									},
									role: {
										type: 'string',
										default: 'User',
									},
									rooms: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/rooms',
										},
										description: 'List of rooms that user is currently in.',
									},
									createdAt: {
										type: 'string',
										format: 'date-time',
									},
									updatedAt: {
										type: 'string',
										format: 'date-time',
									},
								},
							},
						},
					},
					example: {
						email: 'admin@domain.com',
						name: 'Admin 1',
						image: null,
						phone: null,
						role: 'Admin',
						rooms: [
							{
								name: 'Room 1',
								type: 'Direct',
								members: [ '1', '2' ],
								messages: [],
							},
						],
						createdAt: '2020-06-03T17:46:32.679Z',
						updatedAt: '2020-06-03T17:51:11.626Z',
					},
				},
			},
		},
		create: {
			description: 'Create a new user (register).',
			'requestBody.content': {
				'application/json': {
					schema: {
						type: 'object',
						required: [ 'email', 'password' ],
						properties: {
							email: {
								type: 'string',
								format: 'email',
								lowercase: true,
								unique: true,
							},
							password: {
								type: 'string',
								format: 'password',
							},
						},
					},
					examples: {
						default: {
							summary: 'Register with email and password.',
							value: {
								email: 'user@example.com',
								password: 'supersecret',
							},
						},
					},
				},
			},
		},
		update: {
			description: 'Update a user by completely replacing it with a new object.',
		},
		patch: {
			description: 'Update one or more users by merging them with a new object.',
		},
		remove: {
			description: 'Delete a single user specified by _id.',
		},
		multi: [ 'patch' ],
	},
};
