module.exports = (app) => {
	return {
		// eslint-disable-next-line no-unused-vars
		notifier: (action, user, notifierOptions) => {
			const createVerificationUrl = (action, token) => {
				console.log(`${action}::${token}`);
				// TODO: Create a verification URL using token and action
			};

			const sendEmail = async (email) => {
				try {
					const result = await app.service('email').create(email);
					console.log(result);
				} catch (err) {
					console.log(err);
				}
			};

			let verificationUrl;

			let email = {
				from: process.env.GMAIL_ACCOUNT,
				to: user.email,
				subject: '',
				html: null,
			};

			switch (action) {
				// TODO: add more cases
				case 'identityChange':
					verificationUrl = createVerificationUrl(action, user.verifyToken);
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
