/* eslint-disable no-unused-vars */
const Mailer = require('feathers-mailer');

exports.Email = class Email extends Mailer {
	constructor(options) {
		super(options);
		this.options = options || {};
	}

	async create(data, params) {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current) => this.create(current, params)));
		}

		return data;
	}
};
