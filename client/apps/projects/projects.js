Template.noProjects.events({
	'submit form' : function(e, template) {
		e.preventDefault();
		var projectName = template.find(".newProject").value;
		Meteor.call('addProject', projectName, function(error, project){
			if (! error) {
				console.log(project);
			}
		});
	}
	
});
Template.projects.events({
	'click .nav li a': function(e) {	
		e.preventDefault();
		
		$(".projects-container").animate({left: 100}, 200, "easeOutCubic", function(){
			$(".projects-container").fadeOut(400, "easeOutCubic", function(){
				$(e.target).trigger('click');
			});
		});
		
	}
});
Template.signIn.events({
	'submit form': function(e, template) {
		e.preventDefault();
		var email = template.find("#email").value;
		var password = template.find("#password").value;
		Meteor.loginWithPassword(email, password);
	}
});
Template.projects.rendered = function() {
	$('.page-container').addClass("page-projects");
}