function getUsersEmails(projectId, atNames) {
	var usersArray = [];
	
	var users = Meteor.users.find({"profile.projects.projectId": projectId , "profile.atName": { $in: atNames }}).fetch();
	
	_.each(users, function(user) {
		
		usersArray.push(user.emails[0].address);
	});
	return usersArray;
}
Meteor.methods({
	addActivity: function(options) {
		var user = Meteor.users.findOne(this.userId);
		var name = user.profile.fullName || "anonymous";
		var from = user.emails[0].address;
		var username = user.profile.username;
		var url = Meteor.absoluteUrl() + options.frag
		console.log(url);
		Activity.insert({
			author: name,
			username: username,
			docId: options.docId,
			comment: options.comment,
			projectId: options.projectId
		}, function(error) {
			if (!error) {
				if (options.mentions.length) {
					var emails = getUsersEmails(options.projectId, options.mentions);
					Messages.insert({
						to: emails,
						message: options.comment,
						docId: options.docId,
						projectId: options.projectId,
						from: this.userId,
						read: false
					}, function(error){
						if(! error){
							Email.send({
								from: from,
								to: emails,
								replyTo: from || undefined,
								subject: from + " mentioned you.",
								text: from + " mentioned you on the doc app: \n" + url
							});
						}
					});
					
				} else {
					console.log("no mentions");
				}
			}
		});	
	},
	removeActivity: function(){
		Activity.remove({});
	}
});