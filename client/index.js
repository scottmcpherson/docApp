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
			_.each(userRoles, function(val, name){
				Session.set(name, val);
			});	
	});
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

// used to position the sub nav after the
Session.setDefault("leftOrRight", "");

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
	formIcon: function() {
		return Session.equals("active", "forms") ? "glyphicon-wrench wrench active" : "";
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
	slideRight: function() { // pushes the page right when subnav is opened
      return ((Session.equals("active", "docs") || Session.equals("active", "forms")) && Session.equals("subNavActive", false)) ? "slide-right" : "";
   },
   unreadMessages: function() {
   	if (Meteor.user()) {
   		var user = Meteor.user()
	   	var email = user.emails[0].address
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
Template.layout.rendered = function() {
	
	if (amplify.store("layoutPosition") === "right") {

		$('.sub-nav').transition({left: 100}, 100);

		$('.page-container').transition({left: 320}, 100, function() {
			amplify.store("layoutPosition", "alreadyRight");
			$('.sub-nav, .page-container').addClass('right');
		})
		
	}

	// if (amplify.store("layoutPosition") === "left") {
	// 	$('.left-nav').transition({left: -80})
	// 	$('.sub-nav').transition({left: 0})

	// }
		


	// look at this

	if (amplify.store("layoutPosition") === "default") {
		$('.sub-nav, .page-container').addClass("right");
		$('.sub-nav').transition({left: -60}, 100);
		$('.page-container').transition({left: 160}, 100, function() {
			$('.sub-nav, .page-container').removeClass("right");
			amplify.store("layoutPosition", "alreadyDefault");

		})
	}

	if (amplify.store("active") === "docs" || amplify.store("active") === "forms")
		Session.set("active", amplify.store("active"));



	if (amplify.store("layoutPosition") === "alreadyRight") 
		$('.sub-nav, .page-container').addClass('right');

	if (amplify.store("layoutPosition") === "alreadyLeft")
		$('.left-nav, .sub-nav, .page-container').addClass("left");

	// if (amplify.store("layoutPosition") === "alreadyDefault") 
	// 	$('.left-nav, .sub-nav, .page-container').removeClass('left');

	// if (amplify.store("active") === "docs" || amplify.store("active") === "forms")
	// 	Session.set("active", amplify.store("active"));
}
Template.layout.events({
	"click .left-nav ul li a": function(e) {
		
		// if the link that was clicked on was active, remove active
		// and set the up info for layout rendered
		if ($(e.currentTarget).children("span").hasClass("active")) {
			amplify.store("active", "");
			Session.set("active", "");
			amplify.store("layoutPosition", "default");

		// else set up the active class and set up info for layout rendered
		} else {

			// if clicked is "docs" or "forms"
			if ( e.currentTarget.id === "docs" || e.currentTarget.id === "forms" ) {

				if (amplify.store("layoutPosition") !== "alreadyRight") 
					amplify.store( "layoutPosition", "right" );
				
			} else {
				amplify.store("layoutPosition", "");
				$('.sub-nav, .page-container').removeClass("right");
			}

			Session.set( "active", e.currentTarget.id );
			amplify.store( "active", e.currentTarget.id );
			
		}
		
	
		
	},
	"click .show-nav" : function(e) {

		if($('.sub-nav').hasClass('right')) {
			$('.left-nav').transition({left: -100}, 100);
			$('.page-container').transition({left: 220}, 100);
			$('.sub-nav').css("zIndex", 30).transition({left: 0}, 100, function() {
				$('.left-nav, .sub-nav, .page-container').removeClass("right");
				$('.left-nav, .sub-nav, .page-container').addClass("left");
				amplify.store("layoutPosition", "alreadyLeft");
			})
			
		} else {

			$('.left-nav').transition({left: 0}, 80);
			$('.page-container').transition({left: 320}, 100);
			$('.sub-nav').transition({left: 100}, 100, function() {
				$('.left-nav, .sub-nav, .page-container').removeClass("left");
				$('.left-nav, .sub-nav, .page-container').addClass("right");
				amplify.store("layoutPosition", "alreadyRight");
			})
			
			
		}
		
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








