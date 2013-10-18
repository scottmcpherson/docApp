Handlebars.registerHelper("getEmail", function(user) {
	return user.emails[0].address;
});

Template.nonUser.events({
	'click .addUser': function(e) {
		var userId = this._id;
		var projectId = Session.get("currentProjectId");
		console.log(projectId);
		Meteor.call('addUserToProject', {
			userId: userId,
			projectId: projectId
		});
	}
});
Template.user.events({
	'click .editUser': function(e, template) {
		console.log(template);

	}
});	