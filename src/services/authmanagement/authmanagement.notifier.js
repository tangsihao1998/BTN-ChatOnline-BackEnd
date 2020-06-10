const jade = require('jade');
const path = require('path');

module.exports = (app) => {
	const templatePath = path.join(__dirname, 'email-template.jade');

	const createVerificationUrl = (action, token) => {
		const baseUrl = process.env.BASE_URL;
		return `${baseUrl}/${action}?token=${token}`;
	};

	const sendEmail = async (email) => {
		try {
			const result = await app.service('email').create(email);
			console.log(result);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		// eslint-disable-next-line no-unused-vars
		notifier: (action, user, notifierOptions) => {
			let verificationUrl;

			let email = {
				from: process.env.GMAIL_ACCOUNT,
				to: user.email,
				subject: '',
				html: null,
			};

			switch (action) {
				// TODO: add more cases
				case 'resendVerifySignup':
					verificationUrl = createVerificationUrl('verify', user.verifyToken);
					email.subject = 'Verify your registration';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						url: verificationUrl,
						message: 'Please verify your account registration by clicking the following link',
					});
					return sendEmail(email);
				case 'identityChange':
					verificationUrl = createVerificationUrl('verifyChanges', user.verifyToken);
					console.log(verificationUrl);
					// TODO: load email template
					// TODO: Add verificationUrl to email template
					email.subject = 'Your account information has been changed.';
					// email.html = template;
					return sendEmail(email);
				case 'passwordChange':
					email.subject = 'Your password has been changed.';
					// TODO: load email template
					// email.html = template;
					return sendEmail(email);
				default:
					break;
			}
		},
	};
};
