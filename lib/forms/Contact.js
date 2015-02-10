'use strict';

module.exports = function(tollan) {
	var forms = tollan.newforms;

	var ContactForm = forms.Form.extend({
		validation: {on: 'blur change', onChangeDelay: 30},
		name: forms.CharField({
			//helpText: 'Enter your name'
		}),
		realEmail: forms.EmailField({
			required: false,
			label: 'Email',
			//helpText: 'Enter your email address, phone number, or both',
			errorMessages: {
				invalid: 'Not a valid email address'
			}
		}),
		phone: forms.CharField({
			required: false,
			//helpText: 'Enter your email address, phone number, or both'
		}),
		subject: forms.CharField({
			required: false,
			//helpText: 'Enter a short subject (optional)'
		}),
		message: forms.CharField({
			widget: forms.Textarea,
			//helpText: 'Describe what you need'
		}),
		email: forms.CharField({
			required: false,
			label: 'Spam check',
			helpText: 'Leave this blank to verify that you are a human'
		}),
		clean: ['realEmail', 'phone', function() {
			if (!this.cleanedData.realEmail && !this.cleanedData.phone) {
				var message = 'Enter your email address, phone number, or both.';
				this.addError('realEmail', message);
				this.addError('phone', message);
			}
		}]
	});

	return ContactForm;
};
