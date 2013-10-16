Meteor.methods({
	sendMessage: function(options) {
		console.log(options);
		Messages.insert({
			to: options.emails,
			message: options.message,
			docId: options.docId,
			projectId: options.projectId,
			from: this.userId,
			read: false
		});
		var from = contactEmail(Meteor.users.findOne(this.userId));
		Email.send({
			from: from,
			to: options.emails,
			replyTo: from || undefined,
			subject: "You have a new message from " + from,
			text: options.message 
		});
	},
	removeMessages: function(){
		Messages.remove({});
	}
});
var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  return null;
};