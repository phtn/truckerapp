Saved = new Mongo.Collection('saved');

if (Meteor.isClient) {

// LANDING *** helpers

// LANDING *** events
  Template.landing.events({
    'click .calc': function() {
      //toast(document.querySelector('#calc-wc'));
      //console.log('toast');
    },
    'click .saved-calc': function() {
      Router.go('/saved');
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
    }
  });

// RESULTS *** events
  Template.results.events({
    'click #save-results': function(){
      Saved.insert({
        saveMiles: Session.get('getMiles'),
        saveSpeed: Session.get('getSpeed')

      });
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

    }
  });

  
// CALC *** helpers 
  Template.calc.helpers({
    totalHours: function(){
      return Session.get('getTotalHours');
    }
  });

// CALC *** events
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
 // SAVED *** helpers
 Template.saved.helpers({
  saved: function() {
    return Saved.find();
  }
 }); 

 // SAVED *** events
 Template.saved.events({
  'click #exit': function() {
    Router.go('/');
  }
 });

 Session.set('getDrivingAs', 'Team');

  var calc = function(){
      // Total Hours
      var   speedValue = $('#speed-input').val(),
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
        };

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
        } // end of getDurationCalc




  var toast = function(el){
    el.show();
  }

  
} // end of isClient






/* TOAST

var save = function (el){
  el.show();
};

*/





if (Meteor.isServer) {
  Meteor.startup(function () {

    /* first, remove configuration entry in case service is already configured
    Accounts.loginServiceConfiguration.remove({
      service: "google"
    });
    Accounts.loginServiceConfiguration.insert({
      service: "google",
      clientId: "517167569904-u027p85ev6tejj8f5c8jusng6s50noms.apps.googleusercontent.com",
      secret: "4wsvtb2-9rNAvbYyRVlxzw5M"
    });
    */
  });

}

if (Meteor.isCordova) {
  console.log("I'm Mobile");
}
