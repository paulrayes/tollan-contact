'use strict';

module.exports = {
	register: function(tollan, options) {
		if (!process.browser) {
			tollan.app.use('/api/action/contact', require('./actionRoutes')(tollan, options));
		}
	},
	getComponent: require('./components/Form')
};
