'use strict';

var path = require('path');

var campaign = require('campaign');
var VError = require('verror');
var log = require('logule').init(module, 'contact');

var debug = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined);

var validate = require('./validate');

module.exports = function(tollan, config) {

	var client = campaign({
		mandrill: {
			apiKey: config.apiKey
		},
		trap: debug
		//provider: campaign.providers.terminal()
	});

	var router = tollan.express.Router();

	router.post('/submitForm', function(req, res, next) {
		// Process a contact form submission
		//var ContactForm = require('./forms/Contact')(tollan);
		//var form = new ContactForm({data: req.body});
		var errors = validate(req.body);

		if (req.body.email !== '') {
			errors.general = ['This request looks like it might be automated. To protect our users from spam and other malicious activity, we can\'t complete this action right now.'];
			errors.hasError = true;
		};

		if (errors.hasError) {
			return res.status(400).json({errors: errors});
		}

		var templatePath = path.normalize(__dirname + '/layouts/email/contactForm.html');
		var fromEmail = (req.body.realEmail !== '') ? req.body.realEmail : config.email;
		var subject = (req.body.subject !== '') ? req.body.subject : 'Contact Form Submission';

		var data = {
			to: config.email,
			subject: subject,
			from: fromEmail,
			teaser: req.body.message.substr(0, 50),
			data: req.body,
			ip: req.ip
		};

		client.send(templatePath, data, function(err) {
			if (err) {
				log.warn(new VError(err, 'Contact form submission failed'));
				res.status(500).json({});
			} else {
				log.info('Contact form submission sent', {
					subject: data.subject,
					to: data.to,
					from: data.from,
					ip: data.ip
				});
				res.json({status: 'ok'});
			}
		});
	});

	return router;
};
