'use strict';

// Remember to keep this in sync with the README file.

module.exports = {
	campaignClient: {
		//provider: campaign.providers.terminal()
	},
	campaignSend: function(fields) {
		return {
			subject: 'Contact Form Submission: ' + fields.subject,
			teaser: fields.message.substr(0, 100),
			to: 'name@example.com',
			mandrill: {
				tags: ['contact-form']
			}
		};
	},
	campaignSendCopy: function(fields) {
		return {
			subject: 'Contact Form Submission: ' + fields.subject,
			teaser: fields.message.substr(0, 100),
			to: fields.email,
			mandrill: {
				tags: ['contact-form-copy']
			}
		};
	},
	reactComponent: Object,
	template: 'lib/templates/contact.html.mu',
	copySender: true,
	copyTemplate: 'lib/templates/contactCopy.html.mu',
	templateOptions: {}
};
