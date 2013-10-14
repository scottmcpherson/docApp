roles = {
	isAdmin: function(userId, projectId) {
		return this.checkRole(userId, projectId, "isAdmin");
	},
	canWrite: function(userId, projectId) {
		return this.checkRole(userId, projectId, "canWrite");
	},
	canBuild: function(userId, projectId) {
		return this.checkRole(userId, projectId, "canBuild");
	},
	canAssign: function(userId, projectId) {
		return this.checkRole(userId, projectId, "canAssign");
	},
	checkRole: function(userId, projectId, role) {
		console.log("roles checking");
		var project = Projects.findOne({_id: projectId, "users.id": userId});
		
		if (! project)
			return false // no project found for this user??

		var correctUser = _.find(project.users, function(user) {
			return user.id === userId;
		});

		if (! correctUser)
			return false// no user found in this project??

		if(_.contains(correctUser.roles, "isAdmin") || _.contains(correctUser.roles, role))
			return true; // user has role
		return false; // user does not have role
		
	}
}