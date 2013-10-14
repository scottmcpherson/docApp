Meteor.methods({
	addProject: function(projectName) {
		if (! this.userId)
	      throw new Meteor.Error(403, "You must be logged in");
	   user = Meteor.users.findOne(this.userId);
	   var userId = this.userId;
	   // console.log(user);
	   Projects.insert({
	   	name: projectName,
	   	users: [{
	   		id: userId,
	   		roles: []
	   	}]
	   }, function(error, id) {
	   	Meteor.users.update({_id: userId}, {$push: {"profile.projects": { projectId: id }}});
	   	Projects.update({_id: id, "users.id": userId }, { $push: { "users.$.roles": "isAdmin" }}, function(error){
	   		if (error) {
	   			console.log(error);
	   		} else {

	   		};
	   	});
	   });
	},
	removeProjects: function() {
		Projects.remove({});
	},
	addPermissions: function() {
		// both of these work, the bottom one only adds one role

		// Projects.update({_id: "MXLrZvKvQG2MG7PLe", "users.id": "faLxjPyYck2vwDDLv"}, 
		// 	{ $addToSet: { "users.$.roles": { $each: ["isAdmin", "canWrite"] }}});
		Projects.update({_id: "MXLrZvKvQG2MG7PLe", "users.id": this.userId}, 
			{ $addToSet: { "users.$.roles": "canWrite" }});
	},
	removePermissions: function() {
		// both of these work, the bottom one removes roles entirely

		// Projects.update({_id: "MXLrZvKvQG2MG7PLe", "users.id": "faLxjPyYck2vwDDLv"}, 
		// 	{ $pull: { "users.$.roles": "admin" }});

		// Projects.update({_id: "MXLrZvKvQG2MG7PLe", "users.id": "faLxjPyYck2vwDDLv"}, 
		// 	{ $unset: { "users.$.roles": "" }});
	},
	isAdmin: function() {
		console.log("userId: ", this.userId);
		// var project = Projects.findOne({_id: "MXLrZvKvQG2MG7PLe", "users.id": "faLxjPyYck2vwDDLv"});
		console.log("isAdmin: ", roles.isAdmin( this.userId, "MXLrZvKvQG2MG7PLe" ));
		console.log("canWrite: ", roles.canWrite( this.userId, "MXLrZvKvQG2MG7PLe" ));
		console.log("canAssign", roles.canAssign( this.userId, "MXLrZvKvQG2MG7PLe" ));

	}

});