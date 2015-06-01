



  //SUBSCRIBE
  Meteor.subscribe('showSavedResults');
  Meteor.subscribe('showProfile');
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
      return Saved.find({userID: Meteor.userId()}).count();
    }
  });

  // LANDING *** events
  Template.landing.events({
    'click .calc': function() {
    },
    'click .saved-calc': function() {
      Router.go('/saved')
    }, 
    'click .calc': function() {
      Router.go('/calc')
    },
    'click .log': function() {
      Router.go('/logbook')
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
    getProfile: function() {
      return  Profile.find({userID: Meteor.user()._id}).fetch();
    }
  });

  Template.results.rendered = function() {
    Session.set('getDriver',$('#driving-value').text());
    Session.set('getTripDuration', getDurationCalc(Session.get('getRawHours'), getDriveHours(Session.get('getDriver'))));
  };

  // RESULTS *** events
  Template.results.events({
    'click #save-results': function(){
      Meteor.call('saveResults', Meteor.userId(), Session.get('getMiles'), Session.get('getSpeed'), Session.get('getTripDuration'), Session.get('getTotalHours'), Session.get('getTripValue'), Session.get('getPerHour'));
      console.log(Meteor.userId());
      //delete Session.keys['getMiles'];
      toast(document.querySelector('#save-toast'));
    },
    'click #save-sign': function() {
      toast(document.querySelector('#error-save'));
    },
    'click #result-sign': function() {
      Router.go('/signin')
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
    },
    'click #saved-sign': function() {
      Router.go('/signin');
    }
  });

  // SIGN *** EVENTS
  Template.sign_in.events({
    'click #save-preferences': function() {
    Meteor.call('setPreferences', Meteor.userId(), $('#rate-input').val(), $('.drive-toggle').prop('checked'), $('#first-driver-input').val().toUpperCase(), $('#second-driver-input').val().toUpperCase() )
    toast(document.querySelector('#update-preferences-toast'));
    },
    'click .drive-toggle': function() {
      
      if ($('.drive-toggle').prop('checked') == true) {
        $('#sec').fadeIn('slow');
      } else {
        $('#sec').fadeOut('slow');
      }
    }
  });

/*
  Template.sign_in.rendered = function() {

    if ($('.drive-toggle').prop('checked') == true) {
        $('#sec').show();
      } else {
        $('#sec').hide();
      }
  };
*/
  //SIGN *** HELPERS
  Template.sign_in.helpers({
    preferences: function() {
      return  Profile.find({userID: Meteor.user()._id}).fetch();
      Session.set('drive', $('.drive-toggle').prop('checked'));
    }
  });

  //LOG *** EVENTS
  Template.logbook.events({
    'click #log-sign': function() {
      Router.go('/signin');
    },
    'click #add-not-signed': function() {
     toast(document.querySelector('#error-add-log')); 
    }
  });

  //LOG *** HELPERS 
  Template.logbook.helpers({
    drivers: function() {
      return  Profile.find({userID: Meteor.user()._id}).fetch();
    }
  });

  //LOG *** RENDER
  Template.logbook.rendered = function() {
    $('.second').css('color','#444');
  };
  

  var calc = function(){
    // Total Hours
    var speedValue = $('#speed-input').val(),
        distanceValue = $('#distance-input').val(),
        rawHour = distanceValue / speedValue,
        wholeHour = Math.floor(rawHour),
        minDecimal = (rawHour % 1),
        wholeMin = Math.floor(minDecimal * 60),
        driveValue = $('#driving-value').text();

    

    if (speedValue.length == 2){
      $('.hours').fadeIn('slow');


      Session.set('getMiles', distanceValue);
      Session.set('getSpeed', speedValue);
      Session.set('getRawHours', rawHour);

      // glimpse text
      Session.set('getTotalHours', wholeHour + 'h ' + wholeMin + 'm' );

      
      //console.log(driveHours);

    } else if (speedValue.length == 1) {
        $('.hours').fadeOut('slow');
      }
  } // end of keyup #speed-input

  var getDriveHours = function(drive) {
    if (drive == 'Team'){
      return 24;
    } else if( drive == 'Solo') {
      return 11;
    }
  }

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
      }
  });

  //CALC RATE TRIP VALUE
    UI.registerHelper('calcTripValue', function(rate) {
      var calcRate = Session.get('getMiles') * parseFloat(rate);
      Session.set('getTripValue', calcRate);
      return calcRate.toFixed(2);
    });

    UI.registerHelper('calcPerHour', function() {
      var calcPerHour = parseFloat(Session.get('getTripValue')) / Session.get('getRawHours');
      Session.set('getPerHour', calcPerHour);
      return calcPerHour.toFixed(2);
    });

    UI.registerHelper('getDrive', function(drive) {
      var driveText = '';
      if(drive) {
        driveText =  'Solo';
      } else {
        driveText = 'Team'
      }
      return driveText;
      
    });
    









