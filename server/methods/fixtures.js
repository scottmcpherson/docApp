if( Meteor.users.find().count() === 0 ) {
	var admin = ["isAdmin"];
	var canDo = ["canWrite", "canBuild"];
	var id1 = Accounts.createUser({
		email: "scotty.fl27@gmail.com",
		password: "rascal",
		profile: {
			username: "scottmcpherson",
			fullName: "Scott McPherson",
			atName: "@scottmcpherson",
			roles: admin
		}
	});
	Meteor.users.update({_id: id1}, {$set:{ "emails.0.verified": true }});
	var id2 = Accounts.createUser({
		email: "scotty_fl@me.com",
		password: "rascal",
		profile: {
			username: "joebiden",
			fullName: "Joe Biden",
			atName: "@joebiden",
			roles: canDo
		}
	});
	Meteor.users.update({_id: id2}, {$set:{ "emails.0.verified": true }});
	var id3 = Accounts.createUser({
		email: "scott_fl@me.com",
		password: "rascal",
		profile: {
			username: "miketyson",
			fullName: "Mike Tyson",
			atName: "@miketyson",
			roles: canDo
		}
	});
	console.log("created users: ", id1, id2, id3);
	Meteor.users.update({_id: id3}, {$set:{ "emails.0.verified": true }});
}