Meteor.subscribe("projects");
Meteor.subscribe("forms");
Meteor.subscribe("formFields");
Meteor.subscribe("docs");
Meteor.subscribe("directory");
Meteor.subscribe("activity");
Meteor.subscribe("usersMessages");

Deps.autorun(function() {
	var projectId = Session.get("currentProjectId");
	Meteor.call('getRoles', {
		projectId: projectId,
		userId: Meteor.userId()
	}, function(error, userRoles) {
		if(! error)
			console.log(userRoles);
			_.each(userRoles, function(val, name){
				// Handlebars.registerHelper(name, function(){ return val; });
				Session.set(name, val);
			});	
	});
	console.log("updates made");
});
Handlebars.registerHelper("isAdmin", function(){ return Session.get("isAdmin"); });
Handlebars.registerHelper("canWrite", function(){ return Session.get("canWrite"); });
Handlebars.registerHelper("canBuild", function(){ return Session.get("canBuild"); });
Handlebars.registerHelper("canAssign", function(){ return Session.get("canAssign"); });


// used to establish an reactive active class 
// for icons and displaying sub nav
Session.setDefault("active", "");

// used to show and hide left nav
// when sub nav link is clicked
Session.setDefault("subNavActive", false);

// used for the nav current project dropdown
Session.setDefault("currentProjectId", "");

Handlebars.registerHelper('loggedInUser', function() {
	return Meteor.user();
});

Handlebars.registerHelper('isUserOnline', function(userStatus) {
	if(userStatus === true) {
		return "online";
	} else {
		return "offline";
	}
});

var getLastProjectId = function() {
	var lastProjId = localStorage.lastProjectId
	if (lastProjId) 
		return Session.set("currentProjectId", lastProjId) 
	return false
}
Handlebars.registerHelper('makePath', function(context, options) {
	var projectId = Session.get("currentProjectId");
	if(! projectId)
		getLastProjectId();
	var frag = "/projects/" + projectId + "/";
	if (context === 'users')
		return frag + "users";
	if (context === 'docs') 
		return frag + 'docs/' + options._id;
	if (context === 'doc')
		return frag + 'doc/' + options._id;
	if (context === 'forms')
		return frag + 'forms/' + options._id;
			
})

Template.layout.helpers({
	
	docIcon: function() {
		return Session.equals("active", "docs") ? "glyphicon-folder-open active" : "glyphicon-folder-close";
	},
	subNavShow: function() {
		return (Session.equals("active", "docs") || Session.equals("active", "forms")) ? "" : "hide";
	},
	forms: function() {
		return Forms.find();
	},
	showDocs: function() {
		return Session.equals("active", "docs") ? true : false;
	},
	isForms: function() {
		return Session.equals("active", "forms") ? "" : "hide";
	},
	slideLeft: function() {
		return Session.equals("subNavActive", true) ? "slide-left" : "";
	},
	isSubActive: function() {
		return Session.equals("subNavActive", true) ? "" : "hide";
	},
	slideRight: function() {
      return ((Session.equals("active", "docs") || Session.equals("active", "forms")) && Session.equals("subNavActive", false)) ? "slide-right" : "";
   },
   unreadMessages: function() {
   	if (Meteor.user()) {
   		var user = Meteor.user()
	   	var email = user.emails[0].address
	   	console.log(email);
	   	var count = Messages.find({ projectId: Session.get("currentProjectId"), read: false, to: email }).count();
	   	if (count > 0)
	   		return Messages.find({ projectId: Session.get("currentProjectId"), read: false, to: email }).count();
	   	return "";
   	} else {
   		return "";
   	}
   	
   }
   
});

Template.smartBar.helpers({
	smartBarUsers: function() {
   	return Meteor.users.find({ "profile.projects.projectId": Session.get("currentProjectId") }) || false
   }
});
Template.smartBar.rendered = function() {
	$('.draggableUsers').draggable({
		revert: true,
		cursor: "move"
	});
	$("#example").popover();
}
Template.smartBar.events({
	'click .draggableUsers': function(e) {
		console.log("user clicked");
	} 
});

Template.layout.events({
	"click .left-nav ul li a": function(e) {
		
		// For Nav Active Session
		
		if ($(e.currentTarget).children("span").hasClass("active")) {
			Session.set("active", "");
		} else {
			Session.set("active", e.currentTarget.id);
		}
	
		
	},
	"click .sub-nav ul li a": function(e) {

		Session.set("subNavActive", true);
			
	},
	"click .show-nav" : function(e) {
		Session.set("subNavActive", false);
	},
	"click .add-form" : function(e) {
		// e.preventDefault();
		html = '<li id="addForm"><input type="text" class="pull-left"></input><button type="button" class="close cancel-form pull-left" aria-hidden="true">×</button></li>';
		$('#list-forms').prepend(html);
		$('#addForm input').focus();

	},
	'keypress #addForm' : function(e){
		if (e.keyCode === 13) {
			var formName = $(e.target).val().trim();
			var projectId = Session.get("currentProjectId");
			if(projectId) {
				Meteor.call('addForm', {
					name: formName,
					projectId: Session.get("currentProjectId")
				}, function(error, form){
					if(!error)
						$('#addForm').remove();
				});
			}
			// if(form !== undefined) { $('#addForm').remove(); }
		};
	},
	'keypress .add-project' : function(e) {
		if (e.keyCode === 13) {
			// e.preventDefault();
			var projectName = $(e.target).val().trim();
			var id = Projects.insert({ name: projectName });
			Session.set("currentProjectId", id);
		};
	},
	"click .cancel-form": function(e){
		$('#addForm').remove();
	},
	"click #login-dropdown-list": function(e) {
		e.preventDefault();
	}

});








