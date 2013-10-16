Package.describe({
	summary: "jQuery ui with taggit plugin and sew plugin"
});

Package.on_use(function(api) {
	api.use('jquery', 'client');
	api.add_files([
		'jquery-ui-1.10.3.custom.min.js',
		'tag-it.min.js',
		'jquery.caretposition.js',
		'jquery.sew.min.js',
	], 'client');
});