
  Meteor.startup(function () {

  });

  //METHODS
  Meteor.methods({
  	//SAVED
  	removeSaved: function(id) {
  		Saved.remove(id);
  	},
  	saveResults: function(userID, saveMiles, saveSpeed, saveTripDuration, saveTotalHours, saveDate, saveTripValue, savePerHour) {
  		Saved.insert({
  			userID: userID,
	    	saveMiles: saveMiles,
	    	saveSpeed: saveSpeed,
	    	saveTripDuration: saveTripDuration,
	    	saveTotalHours: saveTotalHours,
	    	saveDate: saveDate,
	    	saveTripValue: saveTripValue,
	    	savePerHour: savePerHour
      });
  	},
  	//PROFILE
  	updateRate: function(rate) {
  		Profile.update({code: 1}, {rate: rate});
  	},
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
  	setRate: function(id, rate) {
  		Profile.update(
  			{ userID: id },
  			{ userID: id , rate: rate},
  			{ upsert: true }
		);
  	}
  });



  

