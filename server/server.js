
//Profile = new Mongo.Collection('profile');
  
  Meteor.startup(function () {

  });
  //PUBLISH
  Meteor.publish('showSavedResults', function() {
  	return Saved.find();
  });
  Meteor.publish('showProfile', function() {
  	return Profile.find();
  });
  Meteor.publish('showLogs', function() {
    return Logs.find();
  });

  //METHODS
  Meteor.methods({
  	//SAVED
  	removeSaved: function(id) {
  		Saved.remove(id);
  	},
  	saveResults: function(userID, saveMiles, saveSpeed, saveTripDuration, saveTotalHours, saveTripValue, savePerHour) {
  		Saved.insert({
  			userID: userID,
	    	saveMiles: saveMiles,
	    	saveSpeed: saveSpeed,
	    	saveTripDuration: saveTripDuration,
	    	saveTotalHours: saveTotalHours,
	    	saveTripValue: saveTripValue,
	    	savePerHour: savePerHour,
	    	saveDate: new Date()
      });
  	},
  	
  	//PROFILE
  	removeHourlyRate: function(id) {
  		Profile.remove(id);
  	},
  	insertUser: function(id) {
  		Profile.update(
  			{ userID: id },
  			{ $setOnInsert: { userID: id } },
  			{ upsert: true }
  		);
  	},
  	setPreferences: function(id, rate, drive) {
  		Profile.update(
  			{ userID: id },
  			{ userID: id , rate: rate, drive: drive},
  			{ upsert: true }
		  );
  	}
  });



  

