'use strict';


module.exports = function(tollan) {
	var React = tollan.React;
	var forms = tollan.newforms;

	var ContactForm = forms.Form.extend({
		name: forms.CharField(),
		email: forms.EmailField({required: false}),
		phone: forms.CharField({required: false}),
		subject: forms.CharField({required: false}),
		message: forms.CharField({widget: forms.Textarea}),
		clean: function() {
			if (!this.cleanedData.email && !this.cleanedData.phone) {
				throw forms.ValidationError('Please provide your email, phone number, or both.');
			}
		}
	});

	return React.createClass({
		propTypes: {
			onContact: React.PropTypes.func.isRequired
		},

		/*getInitialState: function() {
			return {
				form: new ContactForm({onChange: this.onFormChange})
			}
		},*/


		onFormChange: function() {
			this.forceUpdate();
		},

		onFormSubmit: function(e) {
			e.preventDefault();

			var form = this.refs.contactForm.getForm();
			var isValid = form.validate();
			if (isValid) {
				//this.props.onContact(form.cleanedData);
				console.log('ze form iz valid');
				this.props.onContact(form.cleanedData);
			}
		},

		render: function() {
			return (
				<form action="" method="POST" onSubmit={this.onFormSubmit} onChange={this.onFormChange}>
					<forms.RenderForm form={ContactForm} ref="contactForm" />
					<input type="submit" />
				</form>
			);
		}
	});
};


/*
<div className="form-group">
							<label>Email address</label>
							<input type="email" className="form-control" placeholder="Enter email" />
						</div>
						*/
