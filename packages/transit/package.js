Package.describe({
	summary: 'A js package for css transitions and transformations'
});

Package.on_use(function(api){
	api.add_files([
		'transit.js'
		],'client');
});