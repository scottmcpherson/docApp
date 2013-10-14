var setProjectId = function(projectId) {
	Session.set("currentProjectId", projectId);
	localStorage.lastProjectId = projectId;
}
Router.configure({
	layoutTemplate: 'layout'
});
Router.map(function() {
	this.route('projects', { 
		path: '/',
		data: function() {
			return {
				projects: Projects.find()
			};
		}
	});
	this.route('showProject', {
		path: 'projects/:_id',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		data: function() {
			return {
				project: Projects.findOne(this.params._id)
			};
		},
		action: function() {
			this.render();
		}
	});
	this.route('listForms', {
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		data: function() {
			return {
				forms: Forms.find()
			};
		}
	});
	this.route('buildForm', {
		path: 'projects/:_id/forms/:formId',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		data: function() {
			return {
				form: Forms.findOne({ _id: this.params.formId }),
				fields: FormFields.find({ formId: this.params.formId }, { sort: { rank: 1 } })
			};
		}
	});
	this.route('listDocs', {
		path: 'projects/:_id/docs/:formId',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		data: function() {
			return {
				docs: Docs.find({ formId: this.params.formId }),
				doc: Docs.findOne({ formId: this.params.formId }),
				form: Forms.findOne({ _id: this.params.formId }),
				formFields: FormFields.find({ formId: this.params.formId }, { sort: { rank: 1 } })
			};
		}
	});
	this.route('createDoc', {
		path: 'createDoc/:_id',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		data: function(){
			return {
				form: Forms.findOne({ _id: this.params._id }),
				fields: FormFields.find({ formId: this.params._id }, { sort: { rank: 1 } })
			};
		}
	});
	this.route('showDoc', {
		path: 'projects/:_id/doc/:docId',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		after: function() {
			Session.set("currentDocId", this.params.docId)
		},
		data: function() {
			return {
				doc: Docs.findOne({ _id: this.params.docId }),
				activity: Activity.find({ docId: this.params.docId })
			};
		}
	});
	this.route('users', {
		path: 'projects/:_id/users',
		before: function() {
			if(Meteor.userId() === null)
				this.redirect('/');
		},
		after: function() {
			setProjectId(this.params._id);
		},
		data: function() {
			return {
				projectUsers: Meteor.users.find({ "profile.projects.projectId": this.params._id }),
				users: Meteor.users.find()
			}
		}
	});
	
});


