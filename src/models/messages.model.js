// messages-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
	const modelName = 'messages';
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const schema = new Schema(
		{
			content: {
				type: String,
				required: true,
			},
			type: {
				type: String,
				default: 'text',
				required: true,
			},
			sender: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'users',
			},
			inRoom: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'rooms',
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
