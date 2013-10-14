Handlebars.registerHelper('sortDocFields', function(context, options) {
	var sorted = context.sort(function(docField1, docField2) {
		return docField1.rank - docField2.rank;
	});
	var ret = "";
	_.each(sorted, function(docField) {
		ret += options.fn(docField);
	});
	return ret;
});
// Template.listDoc.helpers({
// 	docField: function() {
// 		console.log(this._id);
// 		var id = this._id
// 		docFields = DocFields.find({docId: id}, { sort: { rank: 1 }});
// 		return docFields;
// 	}
// });