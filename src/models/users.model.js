// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
	const modelName = 'users';
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const schema = new Schema(
		{
			email: {
				type: String,
				unique: true,
				lowercase: true,
				required: true,
			},
			password: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			image: {
				type: String,
			},
			phone: {
				type: String,
			},
			role: {
				type: String,
				required: true,
				default: 'User',
			},
			rooms: [
				{
					type: Schema.Types.ObjectId,
					ref: 'rooms',
				},
			],
			isVerified: {
				type: Boolean,
				default: false,
			},
			verifyToken: {
				type: String,
			},
			verifyExpires: {
				type: Date,
			},
			verifyChanges: {
				type: Object,
			},
			resetToken: {
				type: String,
			},
			resetExpires: {
				type: Date,
			},
		},
		{
			timestamps: true,
		}
	);

	// This is necessary to avoid model compilation errors in watch mode
	// see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
	if (mongooseClient.modelNames().includes(modelName)) {
		mongooseClient.deleteModel(modelName);
	}
	return mongooseClient.model(modelName, schema);
};
