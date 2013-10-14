Meteor.methods({
	createDoc: function( options ) {
		if(roles.isAdmin( this.userId, options.projectId )){
			return Docs.insert({
				formId: options.formId,
				formName: options.formName,
				docFields: options.docFields
			});
		}
	},
	updateDocRanks: function( options ) {
		console.log(options);
		Docs.update({ 
			formId: options.formId, "docFields.fieldId": options.fieldId }, 
			{ $set: { "docFields.$.rank": options.rank } }, 
			{ multi: true },
			function(error) {
			if(error) {
				console.log(error);
			} else {
				console.log("success");
			}
		});
	},
	removeDocs: function(projectId) {
		Docs.remove({projectId: projectId});
	}
});