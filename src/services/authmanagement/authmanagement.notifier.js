const jade = require('jade');
const path = require('path');

module.exports = (app) => {
	const templatePath = path.join(__dirname, 'email-template.jade');

	const createVerificationUrl = (action, token, path = '') => {
		const baseUrl = process.env.FRONTEND_BASE_URL;
		return `${baseUrl}/${path}${action}?token=${token}`;
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
				case 'resendVerifySignup': // Send verification link after register
					verificationUrl = createVerificationUrl('verifySignupLong', user.verifyToken);
					email.subject = 'Verify your registration';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: `Please verify your account registration by clicking the following link: ${verificationUrl}`,
					});
					return sendEmail(email);
				case 'verifySignup': // Verified successfully. Send confirmation email.
					// verificationUrl = createVerificationUrl('verify', user.verifyToken);
					email.subject = 'Registration successfully verified';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: 'Your account is successfully verified.',
					});
					return sendEmail(email);
				case 'sendResetPwd': // Received a request to reset password
					verificationUrl = createVerificationUrl(
						'resetPwdLong',
						user.resetToken,
						'authentication/'
					);
					email.subject = 'Password reset';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: `You have requested a password reset. Please click on this link to continue with the process: ${verificationUrl}`,
					});
					return sendEmail(email);
				case 'resetPwd': // Password successfully resetted. Send confirmation email
					email.subject = 'Your password has been resetted';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: 'Your password has been successfully resetted.',
					});
					return sendEmail(email);
				case 'passwordChange': // Password changed
					email.subject = 'Your password has been changed';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: 'Your password has been changed.',
					});
					return sendEmail(email);
				case 'identityChange': // User info changed
					email.subject = 'Your account information has been changed';
					email.html = jade.compileFile(templatePath)({
						user: user.name || user.email,
						message: 'Your account information has been changed.',
					});
					return sendEmail(email);
				default:
					break;
			}
		},
	};
};
