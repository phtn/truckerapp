
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
  Meteor.publish('showDriverOneLogs', function() {
    return DriverOneLogs.find();
  });
  Meteor.publish('showDriverTwoLogs', function() {
    return DriverTwoLogs.find();
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
  	setPreferences: function(id, rate, drive, first, second) {
  		Profile.update(
  			{ userID: id },
  			{ userID: id , rate: rate, drive: drive, firstDriver: first, secondDriver: second},
  			{ upsert: true }
		  );
  	},
    //DRIVER ONE
    insertDriverOneLog: function(id, name, logdate, mileage, driving, onduty, isoff) {
      DriverOneLogs.insert({
        userID: id,
        name: name,
        logdate: logdate,
        mileage: mileage,
        driving: driving,
        onduty: onduty,
        isoff: isoff,
        createdAt: new Date()
      })
    },
    removeLogOne: function(id) {
      DriverOneLogs.remove(id)
    },

    //DRIVER TWO
    insertDriverTwoLog: function(id, name, logdate, mileage, driving, onduty, isoff) {
      DriverTwoLogs.insert({
        userID: id,
        name: name,
        logdate: logdate,
        mileage: mileage,
        driving: driving,
        onduty: onduty,
        isoff: isoff,
        createdAt: new Date()
      })
    },
      removeLogTwo: function(id) {
      DriverTwoLogs.remove(id)
    }

  });



  

