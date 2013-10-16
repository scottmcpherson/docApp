Template.listForms.events({
	'click #newForm': function(e){
		e.preventDefault();
		html = "<li id=\"addForm\"><input type=\"text\"></input></li>";
		$('#listForms').prepend(html);
	},
	'keypress #addForm' : function(e){
		if (e.keyCode === 13) {
			var formName = $(e.target).val().trim();
			var form = Forms.insert({
				name: formName
			});	
			if(form !== undefined) { $('#addForm').remove(); }

		};
	}

});