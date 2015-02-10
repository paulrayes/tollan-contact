'use strict';

module.exports = function(tollan) {
	var React = tollan.React;
	var forms = tollan.newforms;
	var BootstrapForm = tollan.BootstrapForm;

	var ContactForm = require('../forms/Contact')(tollan);

	var ContactFormServer = require('../forms/Contact')(tollan);

	return React.createClass({
		/*mixins: [tollan.Router.State],

		statics: {
			willTransitionTo: function(transition, params, query) {
				//console.log(params);
				transition.abort({
					initialData: query,
					initialErrors: {}
				});
			}
		},

		componentWillMount: function() {
			var query = this.props.query;
console.log(this.props.method);
return;
			if (query.method !== 'POST') {
				return;
			}
			delete query.method;
			console.log(query);
			var contactForm = new ContactForm({data: query});
			if (contactForm.validate()) {
				console.log('ze form iz valid');
			} else {
			}
			element.setState({form: contactForm()});
		},

		getInitialState: function() {
			return {
				form: new ContactForm()
			}
		},*/

		getInitialState: function() {
			return {
				form: new ContactForm({
					validation: {on: 'blur change', onChangeDelay: 30},
					onChange: this.onFormChange
				}),
				processing: false,
				submitted: false
			};
		},

		onFormChange: function() {
			this.forceUpdate();
		},

		onFormSubmit: function(e) {
			e.preventDefault();

			// Don't want to submit multiple times
			if (this.state.processing) {
				return;
			}

			var form = this.refs.contactForm.getForm();
			var element = this.refs.contactForm.getDOMNode();

			// Scroll to the top of the form, if the top of the form is not visible
			// TODO this probably doesn't take into account everything, fix it
			if (element.offsetTop < document.body.scrollTop) {
				element.scrollIntoView();
			}

			// Validate our data and if its valid, submit
			if (form.validate()) {

				var data = form.cleanedData;

				this.setState({processing: true});

				tollan.api.post('contact', form.cleanedData)
					.then(function(response) {
						if (response.statusCode === 200) {
							this.setState({submitted: true});
						} else if (response.statusCode === 400) {
							// Validation error on the server
							// Recreate the errors from the server and update our form
							var errors = forms.ErrorObject.fromJSON(response.body.errors);
							form.setErrors(errors);
							this.setState({processing: false});
							this.forceUpdate();
						} else {
							form.addError(null, 'We encountered an error (code: ' + response.statusCode + ') sending your message. Please try again later.');
							this.setState({processing: false});
						}
					}.bind(this), function(response) {
						console.log(response);
					}.bind(this));
			}
		},

		render: function() {
			if (tollan.SERVER) {

				return (
					<div className="well text-center">
						<p><span className="glyphicon glyphicon-refresh glyphicon-spin"></span></p>
						<p>Loading...</p>
					</div>
				);

			} else if (this.state.submitted) {

				return (
					<section className="contact">
						<div className="alert alert-success" role="alert">
							<strong>Success!</strong> Thank you for contacting us. We will reply when we feel like it.
						</div>
					</section>
				);

			} else {

				var submitClassName = 'btn btn-primary btn-lg';
				var submitValue = <span>Submit</span>;

				if (this.state.processing) {
					submitClassName += ' disabled';
					submitValue = (
						<span>
							<span className="glyphicon glyphicon-refresh glyphicon-spin"></span>
							&nbsp;Working...
						</span>
					);
				}

				return (
					<section className="contact">

						<form action="" method="POST"
							onSubmit={this.onFormSubmit}
							>

							<forms.RenderForm form={this.state.form} ref="contactForm">

								<BootstrapForm.Container>

									<BootstrapForm.Row>
										<BootstrapForm.Field name="name" sm="12" />
									</BootstrapForm.Row>

									<BootstrapForm.Row>
										<BootstrapForm.Field name="realEmail" sm="6" />
										<BootstrapForm.Col sm="1" className="text-center">
											<p>&nbsp;</p>
											<p>OR</p>
										</BootstrapForm.Col>
										<BootstrapForm.Field name="phone" sm="5" />
									</BootstrapForm.Row>

									<BootstrapForm.Row>
										<BootstrapForm.Field name="subject" sm="12" />
									</BootstrapForm.Row>

									<BootstrapForm.Row className="email">
										<BootstrapForm.Field name="email" sm="12" />
									</BootstrapForm.Row>

									<BootstrapForm.Row>
										<BootstrapForm.Field name="message" sm="12" />
									</BootstrapForm.Row>

									<BootstrapForm.Row>
										<BootstrapForm.Col sm="12">
											<button type="submit" className={submitClassName}>
												{submitValue}
											</button>
										</BootstrapForm.Col>
									</BootstrapForm.Row>

								</BootstrapForm.Container>

							</forms.RenderForm>

						</form>

					</section>
				);
			}
		}
	});
};


/*
<div className="form-group">
							<label>Email address</label>
							<input type="email" className="form-control" placeholder="Enter email" />
						</div>


						<section className="contact">
					<ContactForm onContact={this.onContact} />
				</section>
						*/
