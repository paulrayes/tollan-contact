tollan-contact
==============

Contact form for Tollan applications. Uses (Campaign)[https://github.com/bevacqua/campaign] to send emails.

Campaign uses Mustache for templating and Mandrill to send emails. Campaign supports changing these, but currently tollan-contact does not.

Getting Started
---------------

Install using npm: (once it's published. For now, clone this repo, `npm install`, and `npm link`.)

	npm install --save tollan-contact

Construct the Tollan module in your application:

	var contact = require('tollan-contact');
	var contactHandler = contact(React, Router, options);

Create a route:

	<Route name="contact" path="/contact" handler={contactHandler} />

Documentation
-------------

The default options are:

	{
		campaignClient: {
			provider: campaign.providers.terminal()
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
		}
		reactComponent: Object,
		template: 'lib/layouts/email/contact.html.mu',
		copySender: true,
		copyTemplate: 'lib/layouts/email/contactCopy.html.mu',
		templateOptions: {}
	}

You can access the Campaign object at `tollanContact.campaign`, and the Campaign client (after creating the tollanContact module) at `tollanContactHandler.client`.

### `campaignClient`

See the Campaign documentation for a description of those options, which are left at the defaults for Campaign. These are used to construct the Campaign client. At a minimum, you will need to set `mandrill.apiKey`, `from`.

### `campaignSend`

A function that returns options that should be given to Campaign's `send` function. The `fields` parameter is an object containing all form fields submitted.

The only required option is `to`, all others may be left undefined.

### `campaignSendCopy`

Similar to `campaignSend`, this is a function that returns options that should be given to Campaign's `send` function for the email copy.

All options may be left undefined.

### `reactComponent`

This should be a React component that presents the contact form to the user. If this is not provided, the default component will be used, with standard Bootstrap HTML markup. The following form fields are required:

`email`: The user should enter their email here. Required.

`message`: The user should enter their message here. Required. The first 100 characters of this are used as the *teaser* for the email message.

The following optional fields are present in the default form but are not required:

`subject`: Appended to the subject of the sent email. Not required.

Any other fields in the form will be displayed at the end of the default email template.

### `subject`

Desired subject of the email. This is NOT a Mustache template, only "|subject|" is replaced with the value of the `subject` form field.

### `to`

Email address to which to send the email when the form is submitted.

### `template`

Path to the Mustache template for the email. All form fields are given to the template.

### `copySender`

Whether to send an email to the address given by the user in the `email` field.

### copyTemplate`

Path to the Mustache template for the email copy. This should probably be very similar to the `template` template.

### `templateOptions`

Object with any values you want, these are passed to the Mustache templates for your use.

Tests
-----

	npm test

License
-------

	   Copyright 2014 Paul Rayes

	   Licensed under the Apache License, Version 2.0 (the "License");
	   you may not use this file except in compliance with the License.
	   You may obtain a copy of the License at

	       http://www.apache.org/licenses/LICENSE-2.0

	   Unless required by applicable law or agreed to in writing, software
	   distributed under the License is distributed on an "AS IS" BASIS,
	   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   See the License for the specific language governing permissions and
	   limitations under the License.
