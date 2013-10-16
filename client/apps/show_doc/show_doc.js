Session.setDefault("currentDocId", "");
Session.setDefault("showComments", false);
Session.setDefault("showMessage", false);
Session.setDefault("messageTo", "");

function getEmails() {
	var usersArray = [];
	var projectId = Session.get("currentProjectId");
	var users = Meteor.users.find({"profile.projects.projectId": projectId }).fetch();
	_.each(users, function(user) {
		usersArray.push(user.emails[0].address);
	});
	return usersArray;
}
function getUsernames() {
	var usernames = [];
	var projectId = Session.get("currentProjectId");
	var users = Meteor.users.find({"profile.projects.projectId": projectId }).fetch();
	_.each(users, function(user) {
		usernames.push({
			val: user.profile.username,
			meta: user.profile.fullName
		});
	});
	return usernames;
}
var getPath = function(){
	return Router.current().path;
}
Template.showDoc.events({
	'click .show-comments': function(e) { Router.go(getPath() + "/a") },
	'click .close-comments': function(e) { Router.go(getPath().replace(/\/a$/, "")); },
	'click .close-message': function(e) { Session.set("showMessage", false); }
});
Template.commentsDialog.events({
	'click .submitComment': function(e, template) {
		var comment = template.find('#comment').value;
		var docId = Session.get("currentDocId");
		var mentions = comment.match(/@[\w]+/g) || [];
		var wholeFrag = Router.current().path.substr(1);
		var frag = wholeFrag.slice(-2) == "/a" ?  wholeFrag : wholeFrag + "/a";
	
		Meteor.call('addActivity', {
			docId: docId,
			comment: comment,
			mentions: mentions,
			projectId: Session.get("currentProjectId"),
			frag: frag
		});
		template.find('#comment').value = "";
	}
});
Template.messageDialog.events({
	'click .send-message': function(e, template) {
		e.preventDefault();
		var emailArray = $("#myTags").tagit("assignedTags");
		var message = template.find("textarea#message").value;
		Meteor.call('sendMessage', {
			emails: emailArray,
			message: message,
			projectId: Session.get("currentProjectId"),
			docId: Session.get("currentDocId")
		}, function(error){
			if(! error)
				Session.set("showMessage", false);
		});
	}
});
Template.showDoc.showCommentsDialog = function() {
	return Session.get("showComments");
}
Template.showDoc.showMessageDialog = function() {
	return Session.get("showMessage")
}
Template.commentsDialog.rendered = function() {
	var values = getUsernames();
	var customItemTemplate = "<div><span />&nbsp;<small /></div>";

				function elementFactory(element, e) {
					var template = $(customItemTemplate).find('span')
															.text('@' + e.val).end()
												   		.find('small')
															.text("(" + (e.meta || e.val) + ")").end();
					element.append(template);
				};
	$('#comment').sew({values: values, elementFactory: elementFactory});
}
Template.messageDialog.rendered = function() {
	var messageTo = Session.get("messageTo");
	
	if (messageTo === "group"){
		console.log("messageTo is group");
		var projectUsers = Meteor.users.find({"profile.projects.projectId": Session.get("currentProjectId")}).fetch();
		_.each(projectUsers, function(user) {
			$("#myTags").prepend("<li>"+ user.emails[0].address +"</li>");
		});
	} else {
		var toUser = Meteor.users.findOne({_id: Session.get("messageTo")});
		var toUserEmail = toUser.emails[0].address;
		$("#myTags").prepend("<li>"+ toUserEmail +"</li>");
	}
	
	// console.log(toUserEmail);
	$("#myTags").tagit({
		availableTags: getEmails()
	});
}
Template.messageDialog.to = function() {
	return Meteor.users.findOne({_id: Session.get("messageTo")})
}
Template.showDoc.rendered = function() {
	$('#droppable').droppable({
		hoverClass: "drop-hover",
		drop: function( event, ui ) {
			Session.set("messageTo", $(ui.draggable).data("id"));
			Session.set("showMessage", true);
		}
	});
	
}