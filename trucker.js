Saved = new Mongo.Collection('saved');
Profile = new Mongo.Collection('profile');


if (Meteor.isClient) {



  // HOME *** events
  Template.home.events({
    'click .sign': function() {
      
      Router.go('/signin');
    },
    'click .title': function() {
      Router.go('/');
    }
  });

  // LANDING *** helpers
  Template.landing.helpers({
    save_count: function() {
      return  Profile.find({userID: Meteor.userId()}).count();
    }
  });

  // LANDING *** events
  Template.landing.events({
    'click .calc': function() {
      //toast(document.querySelector('#calc-wc'));
      //console.log('toast');
    },
    'click .saved-calc': function() {
      Router.go('/saved');
    }, 
    'click .calc': function() {
      Router.go('/calc')
    }
  });


  // RESULTS *** helpers
  Template.results.helpers({
    totalHours: function(){
      return Session.get('getTotalHours');
    },
    tripDuration: function(){
      return Session.get('getTripDuration');
    },
    drivingAs: function(){
      return Session.get('getDrivingAs');
    },
    miles: function(){
      return Session.get('getMiles');
    },
    speed: function(){
      return Session.get('getSpeed');
    },
    ratePerMile: function() {
      return  Profile.find({userID: Meteor.user()._id}).fetch();
    }
  });

  // RESULTS *** events
  Template.results.events({
    'click #save-results': function(){
      Meteor.call('saveResults', userID, saveMiles, saveSpeed, saveTripDuration, saveTotalHours, saveDate, saveTripValue, savePerHour);
      toast(document.querySelector('#save-toast'));
    },
    'click #driving-value': function(){
      
      if (Session.get('getDrivingAs') == 'Team'){
        Session.set('getDrivingAs', 'Solo');
        return Session.set('getTripDuration', getDurationCalc(Session.get('getRawHours'), 11));
      } else {
        Session.set('getDrivingAs', 'Team');
        return Session.set('getTripDuration', getDurationCalc(Session.get('getRawHours'), 24));
      }

    },
    'click #hourlyRate': function() {
      Meteor.call('removeHourlyRate', this._id);
    }
  });

  
  // CALC *** HELPERS
  Template.calc.helpers({
    totalHours: function(){
      return Session.get('getTotalHours');
    }
  });

  // CALC *** EVENTS
  Template.calc.events({
    'click .check-save': function() {
      console.log('check-save clicked');
    },
    'keyup #speed-input': function(e) {
      calc(); // get total hours

      if (e.which === 13) {
        Router.go('/results');
      } // enter key
    }
  });

  // SAVED *** HELPERS
  Template.saved.helpers({
    saved: function() {
      return  Saved.find({userID: Meteor.user()._id}).fetch().reverse();
    }
  }); 

  // SAVED *** EVENTS
  Template.saved.events({
    'click #exit': function() {
    Router.go('/');
    },
    'click .saved-li': function() {
      Meteor.call('removeSaved', this._id);
    }
  });

  // SIGN *** EVENTS
  Template.sign_in.events({
    'click #save-preferences': function() {
    console.log(Meteor.userId());
    Meteor.call('setRate', Meteor.userId(), $('#rate-input').val())
    toast(document.querySelector('#update-rate-toast'));
    }
  });



  Session.set('getDrivingAs', 'Team');

  var calc = function(){
    // Total Hours
    var speedValue = $('#speed-input').val(),
        distanceValue = $('#distance-input').val(),
        rawHour = distanceValue / speedValue,
        wholeHour = Math.floor(rawHour),
        minDecimal = (rawHour % 1),
        wholeMin = Math.floor(minDecimal * 60);

    if (speedValue.length == 2){
      $('.hours').fadeIn('slow');


      Session.set('getMiles', distanceValue);
      Session.set('getSpeed', speedValue);
      Session.set('getRawHours', rawHour);

      // glimpse text
      Session.set('getTotalHours', wholeHour + 'h ' + wholeMin + 'm' );
      
      if (Session.get('getDrivingAs') == 'Team'){
        var driveHours = 24;
      } else {
        var driveHours = 11;
      }

      Session.set('getTripDuration', (getDurationCalc(Session.get('getRawHours'), driveHours)));
      //console.log(driveHours);

    } else if (speedValue.length == 1) {
        $('.hours').fadeOut('slow');
      }
  } // end of keyup #speed-input


  var getDurationCalc = function (raw, driveHours){

    var rawDays = raw / driveHours;
    //console.log(rawDays);
    var hours = (rawDays % 1)*driveHours;
    var mins = (hours % 1)*60;

    if (rawDays < 1){
      var teamTime = Math.floor(hours) + 'h ' + Math.floor(mins) + 'm';
    } else {
      var teamTime = Math.floor(rawDays) + 'd ' + Math.floor(hours) + 'h ' + Math.floor(mins) + 'm';
    }
    return teamTime;
  } //END OF GETDURATIONCALC

  //TOAST
    var toast = function(el){
      el.show();
    }

  //INSERT PROFILE
    Deps.autorun(function(){
      if(Meteor.userId()){
        //Session.set('userID', Meteor.userId());
        Meteor.call('insertUser', Meteor.userId());
        //console.log(Meteor.userId());
      }
  });

  //CALC RATE TRIP VALUE
    Handlebars.registerHelper('calcTripValue', function(rate) {
      var calcRate = Session.get('getMiles') * parseFloat(rate);
      Session.set('getTripValue', calcRate);
      return calcRate.toFixed(2);
    });

    Handlebars.registerHelper('calcPerHour', function() {
      var calcPerHour = parseFloat(Session.get('getTripValue')) / Session.get('getRawHours');
      Session.set('getPerHour', calcPerHour);
      return calcPerHour.toFixed(2);
    });
    
  //RESULTS VALUES
  var userID = Meteor.userId(),
      saveMiles = Session.get('getMiles'),
      saveSpeed = Session.get('getSpeed'),
      saveTripDuration = Session.get('getTripDuration'),
      saveTotalHours = Session.get('getTotalHours'),
      saveDate = new Date(),
      saveTripValue = Session.get('getTripValue');
      savePerHour = Session.get('getPerHour');
  
} //END OF CLIENT








