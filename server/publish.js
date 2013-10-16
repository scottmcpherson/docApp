Meteor.publish("projects", function() {
	return Projects.find({"users.id": this.userId});
});
Meteor.publish("forms", function() {
  return Forms.find();
});
Meteor.publish("formFields", function(){
	return FormFields.find();
});
Meteor.publish("docs", function() {
	return Docs.find();
});
Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});
Meteor.publish("activity", function() {
	return Activity.find();
})
Meteor.publish("usersMessages", function() {
	if(this.userId){
		var id = this.userId;
		var user = Meteor.users.findOne({_id: id});
		var email = user.emails[0].address;
		return Messages.find();
	}
});