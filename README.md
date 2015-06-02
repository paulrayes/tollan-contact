tollan-contact
==============

Contact form for Tollan applications. Uses [Campaign](https://github.com/bevacqua/campaign) to send emails, Mustache for templating, and Mandrill to send emails.

Currently it is not configurable.

Getting Started
---------------

This is not on npm yet, so clone this repo, `npm install`, `npm link`, then in your project `npm link tollan-contact`.

Register in your application:

	var contact = require('tollan-contact');
	var contactOptions = {
		apiKey: 'insert your Mandrill API key here',
		email: 'insert the email address to which you want to receive emails here'
	};
	Promise.all([
		...
		contact.register(tollan, contactOptions),
		...
	]).then(function() {
		tollan.startEventStreamer();
	}).done();

You are also given a React component which you can retreive with:

	var Contact = require('tollan-contact').getComponent(tollan);

Currently it has no settings, just use it like

	<Contact />

Documentation
-------------

TODO

License
-------

	   Copyright 2014-2015 Paul Rayes

	   Licensed under the Apache License, Version 2.0 (the "License");
	   you may not use this file except in compliance with the License.
	   You may obtain a copy of the License at

	       http://www.apache.org/licenses/LICENSE-2.0

	   Unless required by applicable law or agreed to in writing, software
	   distributed under the License is distributed on an "AS IS" BASIS,
	   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   See the License for the specific language governing permissions and
	   limitations under the License.
