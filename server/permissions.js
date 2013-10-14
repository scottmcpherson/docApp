Projects.allow({
	insert: function(userId, doc) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	update: function(userId, doc) {
		return true;
	}
});
Forms.allow({
  insert: function(userId, doc) {
     return true;
  },
  remove: function(userId, doc) {
  	  return true;
  }
});
FormFields.allow({
	insert: function(userId, doc) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	update: function(userId, doc) {
		return true;
	}
});
Docs.allow({
	insert: function(userId, doc) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});


