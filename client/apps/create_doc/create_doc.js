Template.createDoc.events({
	'submit form': function(e) {
		// going to want to make this a method call
		e.preventDefault();

		var formData = $('.form-group');
		var formId = this.form._id;
		var formName = this.form.name;
		var fields = [];

		_.each(formData, function( formGroup, index ){
			fields.push({
				fieldId: $(formGroup).data("id"),
				rank: index,
				label: $(formGroup).children()[0].innerHTML,
				value: $(formGroup).children()[1].value || "n/a"
			});
		});
		console.log("called");
		Meteor.call('createDoc', {
			formId: formId,
			formName: formName,
			docFields: fields,
			projectId: Session.get("currentProjectId")
		}, function( error, docId ) {
			if(!error) {
				console.log(docId);
			} else {
				console.log(error);
			}
		});
	}
});