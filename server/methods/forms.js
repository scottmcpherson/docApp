Meteor.methods({
	addForm: function(options) {
		console.log(options);
		check(options.projectId, String);
		check(options.name, String);
		
		if (! this.userId)
			throw new Meteor.Error(403, "You must be logged in");

		var project = Projects.findOne({_id: options.projectId, "users.id": this.userId });
		// console.log(project);
		if (!project)
			return false// handle that
		
		Forms.insert({
			projectId: options.projectId,
			name: options.name,
			createBy: this.userID
		}, function(error) {
			if (error) {
			};
		})

	},
	removeForms: function(){
		Forms.remove({});
	}
})