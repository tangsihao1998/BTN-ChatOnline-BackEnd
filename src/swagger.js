const swagger = require('feathers-swagger');

// TODO: Configure swagger properly
module.exports = swagger({
	openApiVersion: 3,
	docsPath: '/docs',
	docsJsonPath: '/docs/json',
	uiIndex: true,
	specs: {
		info: {
			title: 'Chat-Online-BackEnd',
			description: 'A RESTful chat API powered by FeathersJS',
			version: '1.0.0',
		},
	},
	ignore: {
		paths: [ 'email' ],
	},
});
