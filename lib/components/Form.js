'use strict';

var validate = require('../validate');

module.exports = function(tollan) {
	var React = tollan.React;

	var form = require('forrrm')(React);
	var TextInput = form.TextInput;

	return React.createClass({

		getInitialState: function() {
			return {
				processing: false,
				submitted: false,
				errors: {hasError: true},
				data: {
					realEmail: '',
					phone: '',
					subject: '',
					email: '',
					message: ''
				}
			};
		},

		onFormChange: function() {
			this.forceUpdate();
		},
		validate: function(key, value) {
			var changedData = {};
			changedData[key] = value;
			var newData = Object.assign({}, this.state.data, changedData);
			var newErrors = Object.assign({}, this.state.errors);
			var errors = validate(newData);
			newErrors[key] = errors[key];
			newErrors.hasError = errors.hasError
			this.setState({errors: newErrors, data: newData});
		},
		onNameChange: function(value) {
			this.validate('name', value);
		},
		onEmailChange: function(value) {
			this.validate('realEmail', value);
		},
		onPhoneChange: function(value) {
			var newValue = value.replace(/[^+\-\.\(\)\/ 0-9]/g, '');
			this.validate('phone', newValue);
		},
		onSubjectChange: function(value) {
			this.validate('subject', value);
		},
		onMessageChange: function(value) {
			this.validate('message', value);
		},
		onCaptchaChange: function(value) {
			var newData = Object.assign({}, this.state.data, {email: value});
			this.setState({data: newData});
		},

		onFormSubmit: function(e) {
			e.preventDefault();

			// Don't want to submit multiple times
			if (this.state.processing) {
				return;
			}

			//var form = this.refs.contactForm.getForm();
			var element = this.refs.form.getDOMNode();

			// Scroll to the top of the form, if the top of the form is not visible
			// TODO this probably doesn't take into account everything, fix it
			if (element.offsetTop < document.body.scrollTop) {
				element.scrollIntoView();
			}

			var errors = validate(this.state.data);

			this.setState({errors: errors});

			// Validate our data and if its valid, submit
			if (errors.hasError) {
				return this.setState({errors: errors});
			}

			this.setState({processing: true});

			tollan.postAction('contact/submitForm', this.state.data)
				.then((response) => {
					this.setState({submitted: true});
				}).catch((response) => {
					if (response.statusCode === 400) {
						// Validation error on the server
						// Recreate the errors from the server and update our form
						this.setState({errors: response.body.errors, processing: false});
					} else {
						errors.general = 'We encountered an error (code: ' + response.statusCode + ') sending your message. Please try again later.';
						this.setState({errors: errors, processing: false});
					}
				}).done();
		},

		render: function() {
			if (!process.browser) {
				return (
					<section className="contact">
						<tollan.loaderComponents.large />
					</section>
				);
			} else if (this.state.submitted) {

				return (
					<section className="contact">
						<div className="Alert" role="alert">
							<h3>Success!</h3>
							<p>Thank you for contacting me. Expect a reply in a day or two.</p>
						</div>
					</section>
				);

			} else {

				//var submitClassName = 'Button-blue';
				var submitValue = <span>Submit</span>;

				if (this.state.processing) {
					//submitClassName += ' disabled';
					submitValue = <tollan.loaderComponents.small />
				}

				var alert;
				if (this.state.errors.general) {
					alert = <div className="Alert-error" role="alert">{this.state.errors.general}</div>;
				}

				return (
					<section className="contact">

						<form action="" method="POST" onSubmit={this.onFormSubmit} ref="form">
							{alert}
							<TextInput label="Name" name="name" placeholder="Enter your name" value={this.state.data.name} onChange={this.onNameChange} errorText={this.state.errors.name} />
							<TextInput label="Email" name="realEmail" placeholder="Enter your email address" value={this.state.data.realEmail} onChange={this.onEmailChange} errorText={this.state.errors.realEmail} />
							<TextInput label="Phone Number" name="phone" placeholder="Enter your phone number" value={this.state.data.phone} onChange={this.onPhoneChange} errorText={this.state.errors.phone} />
							<TextInput label="Subject" name="subject" placeholder="What is your message about?" value={this.state.data.subject} onChange={this.onSubjectChange} errorText={this.state.errors.subject} />
							<div style={{display:'none'}}>
								<TextInput label="Spam check: Leave this blank to verify that you are a human" name="email" placeholder="" value={this.state.data.email} onChange={this.onCaptchaChange} />
							</div>
							<TextInput label="Message" name="message" multiline={true} placeholder="" value={this.state.data.message} onChange={this.onMessageChange} errorText={this.state.errors.message} />

							<button type="submit" className="Button-blue" disabled={this.state.processing ? "disabled" : ""}>
								{submitValue}
							</button>

						</form>

					</section>
				);
			}
		}
	});
};
