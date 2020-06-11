// Initializes the `email` service on path `/email`
const hooks = require('./email.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(app) {
	const options = {
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT,
			pass: process.env.GMAIL_PASSWORD,
		},
	};

	const emailService = new Mailer(smtpTransport(options));

	// Initialize our service with any options it requires
	app.use('/email', emailService);

	// Get our initialized service so that we can register hooks
	const service = app.service('email');

	service.hooks(hooks);
};
