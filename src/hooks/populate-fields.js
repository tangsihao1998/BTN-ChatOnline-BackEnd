// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = { fields: [] }) => {
	return async (context) => {
		// Get `params` from the hook context
		const { params } = context;

		// Add selected fields to $populate query param
		if (!params.query) params.query = {};
		params.query.$populate = [ ...options.fields ];

		return context;
	};
};
