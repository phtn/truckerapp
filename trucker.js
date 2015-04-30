
if (Meteor.isClient) {

  Template.results.events({
    'click .save-result': function(){
      console.log('result saved.');
    },
    'change #drive-toggle-button': function(){
      $(".check-save").fadeIn('slow');
      console.log('toggle changed.');
    }
  });

  Template.results.helpers({
    totalHours: function(){
      return Session.get('getTotalHours');
    },
    tripDuration: function(){
      return Session.get('getTripDuration');
    }
  });

  Template.calc.events({
    'click .check-save': function(){
      console.log('check-save clicked');
    },
    'keyup #speed-input': function(){
      var s = $("#speed-input"), // speed-input
          b = $(".get-btn"), // button
          c = $(".get"); //check

      if (s.val().length != 0 && $('#distance-input').val().length != 0){
        b.prop('disabled', false);
        b.css('background-color', '#34bf49');

      } else {
        b.prop('disabled', true);
        c.css('color', '#fff');
      }
    },
    'click .get-btn': function(){

      // Total Hours
      var speedValue = $('#speed-input').val(),
          distanceValue = $('#distance-input').val(),
          rawHour = distanceValue / speedValue,
          wholeHour = Math.floor(rawHour),
          minDecimal = (rawHour % 1),
          wholeMin = Math.floor(minDecimal * 60);

      $('.hours').fadeIn('slow');

      Session.set('getTotalHours', wholeHour + ' hrs ' + wholeMin + ' mins' );

      // Trip Duration
      getDrive();

      var greater = function(hour){

        var rawDays,
            dayString = 'day';

        if (wholeHour >= hour){ // >= Team Day
          rawDays = wholeHour / hour;
          var wholeDay = Math.floor(rawDays),
              hourDecimal = (rawDays % 1),
              dMinDecimal = (hourDecimal % 1),
              fullHour = Math.floor(hourDecimal * hour),
              dWholeMin = Math.floor(dMinDecimal * 60);


          if (wholeDay > 1){
            dayString += 's';
          }

          return Session.set('getTripDuration', wholeDay + ' ' + dayString + ' ' + fullHour + ' hrs  ' + dWholeMin + ' mins');
        } else { // < Day
          return Session.set('getTripDuration', wholeHour + ' hrs  ' + wholeMin + ' mins');
        }
      };

      if (getDrive() == false){ // Team
        greater(24);
      } else { // Solo
        greater(11);
      }
    }



  });
}

// EXAMPLE FUNCTION
var getDrive = function(){
  var tog = $('#drive-toggle-button').prop('checked');
  return tog;
  console.log(tog);
};




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
/*
  // counter starts at 0

  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  */
