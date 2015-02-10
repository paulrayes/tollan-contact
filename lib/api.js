'use strict';

var path = require('path');

var campaign = require('campaign');
var VError = require('verror');

var debug = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined);

module.exports = function(tollan, config) {

	var client = campaign({
		mandrill: {
			apiKey: config.apiKey
		},
		//trap: debug ? config.email : false
		//provider: campaign.providers.terminal()
	});

	var router = tollan.express.Router();

	router.post('/', function(req, res, next) {
		// Process a contact form submission
		var ContactForm = require('./forms/Contact')(tollan);
		var form = new ContactForm({data: req.body});

		form.clean = function() {
			if (form.cleanedData.email !== '') {
				form.addError(null, 'This request looks like it might be automated. To protect our users from spam and other malicious activity, we can\'t complete this action right now.');
			}
		};

		if (form.validate()) {
			var templatePath = path.normalize(__dirname + '/layouts/email/contactForm.html');
			var fromEmail = (form.cleanedData.realEmail !== '') ? form.cleanedData.realEmail : config.email;
			var subject = (form.cleanedData.subject !== '') ? form.cleanedData.subject : 'Contact Form Submission';

			var data = {
				to: config.email,
				subject: subject,
				from: fromEmail,
				teaser: form.cleanedData.message.substr(0, 50),
				data: form.cleanedData,
				ip: req.ip
			};

			client.send(templatePath, data, function(err) {
				if (err) {
					tollan.log.warn(new VError(err, 'Contact form submission failed'));
					res.status(500).json({});
				} else {
					tollan.log.info('Contact form submission sent', {
						subject: data.subject,
						to: data.to,
						from: data.from,
						ip: data.ip
					});
					res.json({});
				}
			});
		} else {
			res.status(400).json({
				errors: form.errors()
			})
		}
	});

	return router;
};
