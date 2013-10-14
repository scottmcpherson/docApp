Meteor.methods({
	getRoles: function(options) {
		Log(this.userId);
		Log(options.projectId);
		check(options.userId, String);
		check(options.projectId, String);
		if (options.userId !== this.userId) return false;
		var userId = this.userId, projId = options.projectId;
		return {
			isAdmin: roles.isAdmin(userId, projId),
			canWrite: roles.canWrite(userId, projId),
			canBuild: roles.canBuild(userId, projId),
			canAssign: roles.canAssign(userId, projId)
		}
	}
})