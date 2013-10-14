// ---- Work on later once live
// Meteor.methods({
// 	addUser: function(options) {
// 		if (! options.email)
// 			// no email
// 		if (! options.password)
// 			// no password
// 		if (! options.projectId)
// 			// need a project to add user to
// 		if (! this.userId)
// 			// need to be logged in to add users
// 		var id = Accounts.createUser({
// 			email: options.email,
// 			password: options.password
// 		});
// 		console.log(id);
// 		// if (id)
// 		// 	Projects.update({_id: options.projectId}, { $push: { users: { id: id } }})
// 	}
// })
Meteor.users.allow({
	update: function(userId, doc) {
		return true;
	}
})
Meteor.methods({
	addUserToProject: function(options) {
		Projects.update({_id: options.projectId}, { $addToSet: { users: { id: options.userId }}}, function(error){
			if (! error)
				Meteor.users.update({_id: options.userId}, { $addToSet: { "profile.projects": { projectId: options.projectId }}});
		});
	},
	removeUsers: function() {
		Meteor.users.remove({});
	}
})