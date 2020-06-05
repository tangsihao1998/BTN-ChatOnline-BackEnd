// Initializes the `email` service on path `/email`
const { Email } = require('./email.class');
const hooks = require('./email.hooks');

const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(app) {
	const options = smtpTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

	const emailService = new Email(options, app);

	// Initialize our service with any options it requires
	app.use('/email', emailService);

	// Get our initialized service so that we can register hooks
	const service = app.service('email');

	service.hooks(hooks);
};
