
'use strict';

require('node-jsx').install({extension: '.jsx'});

module.exports = function(tollan, options) {
	return require('./contact')(tollan, options);
};
