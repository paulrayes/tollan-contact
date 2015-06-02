'use strict';

module.exports = function validate(data) {
	var errors = {
		name: undefined,
		realEmail: undefined,
		phone: undefined,
		subject: undefined,
		email: undefined,
		message: undefined,
		hasError: false
	};
	if (typeof data.name === 'undefined' || data.name.length === 0) {
		errors.name = ['Name is required'];
	}
	if (typeof data.realEmail === 'undefined' || data.realEmail.length === 0) {
		if (typeof data.phone === 'undefined' || data.phone.length === 0) {
			errors.realEmail = ['Either email or phone is required'];
		}
	}
	if (typeof data.message === 'undefined' || data.message.length === 0) {
		errors.message = ['Message is required'];
	}
	errors.hasError = Object.keys(errors).some(function(key) {
		return errors[key];
	});
	return errors;
};
