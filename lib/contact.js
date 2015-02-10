
'use strict';

//var campaign = require('campaign');

//var defaultOptions = require('./defaultOptions');

module.exports = function(tollan, options) {
	// TODO check if options.reactComponent is set and use that if so
	var handler = require('./components/Form');

	return handler;
};
