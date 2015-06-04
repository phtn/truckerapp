



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
    $('.goto-saved').hide();
  };

  // RESULTS *** events
  Template.results.events({
    'click #save-results': function(){
      Meteor.call('saveResults', Meteor.userId(), Session.get('getMiles'), Session.get('getSpeed'), Session.get('getTripDuration'), Session.get('getTotalHours'), Session.get('getTripValue'), Session.get('getPerHour'));
      
      //console.log(Meteor.userId());
      //delete Session.keys['getMiles'];
      
      toast(document.querySelector('#save-toast'));
      setTimeout($('.goto-saved').fadeIn('slow'), 10000);
    },
    'click #save-sign': function() {
      toast(document.querySelector('#error-save'));
    },
    'click #result-sign': function() {
      Router.go('/signin')
    },
    'click .goto-saved-btn': function() {
      Router.go('/saved');
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
      history.back();
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
    'change .drive-toggle': function() {
      
      //console.log($('.drive-toggle').prop('checked'));

      if ($('.drive-toggle').prop('checked') == false) {
        $('#sec').fadeIn('slow');
        $('#team-icon').css('color', '#4dc47d')
        $('#solo-icon').css('color', '#656565')

      } else {
        $('#sec').fadeOut('slow');
        $('#solo-icon').css('color', '#4dc47d')
        $('#team-icon').css('color', '#656565')
      }
    }
  });


  Template.sign_in.rendered = function() {
    var getUserDrive = Profile.findOne({userID: Meteor.userId()})
    var isDrive = (getUserDrive && !getUserDrive.drive);
      $('#sec').toggle(isDrive);
  };

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
    'click #add-log-btn': function() {
      Router.go('/addlog');
    },
    'click #add-not-signed': function() {
     toast(document.querySelector('#error-add-log')); 
    },
    'click .second': function() {
      $('.second').css('color', '#ccc');
      $('.first').css('color', '#444');
      $('#first-driver-log').fadeOut('fast');
      $('#second-driver-log').fadeIn('slow');
      Session.set('whichDriver', $('.second').text());
    },
    'click .first': function() {
      $('.first').css('color', '#ccc');
      $('.second').css('color', '#444');
      $('#second-driver-log').fadeOut('fast');
      $('#first-driver-log').fadeIn('slow');
      Session.set('whichDriver', $('.first').text());
    },
    'click .li-logs-one': function() {
      Meteor.call('removeLogOne', this._id);
    },
    'click .li-logs-two': function() {
      Meteor.call('removeLogTwo', this._id);
    },
    'click #back-to-home': function() {
      Router.go('/');
    },
    'click #total-mileage-text': function() {
      var mileage = DriverOneLogs.find({name: $('.first').text()}).fetch().reverse();
      var count = 0;
      var mileageArr = [];
      var totalMileage = 0;
      mileage.forEach(function (miles) {
        //console.log(count + ": " + miles.mileage);
        count += 1;
        var each = parseFloat(miles.mileage);
        mileageArr.push(each);
        console.log(each);

        for (var i = 0, sum = 0; i < mileageArr.length; sum += mileageArr[i++]) {
        //console.log(count + ' ' + sum);
      
        }
      //console.log(mileageArr.length);
      console.log(sum);
      Session.set('totalMileage', sum);
      });
    }
  });

  //LOG *** HELPERS 
  Template.logbook.helpers({
    drivers: function() {
      return  Profile.find({userID: Meteor.userId()}).fetch();
    },
    driverLogOne: function() {
      Meteor.subscribe('showDriverOneLogs');
      return DriverOneLogs.find({userID: Meteor.userId()}).fetch().reverse();
    },
    driverLogTwo: function() {
      Meteor.subscribe('showDriverTwoLogs');
      return DriverTwoLogs.find({userID: Meteor.userId()}).fetch().reverse();
    },
    getTotalMileage: function() {
      return Session.get('totalMileage');
    }

  });

  

  //LOG *** RENDER
  Template.logbook.rendered = function() {
    Meteor.subscribe('showDriverOneLogs');
    var getProfile = Profile.findOne({userID: Meteor.userId()}),
        isTeam = (getProfile && !getProfile.drive);
      $('.second-driver-div').toggle(isTeam);
      $('.second').css('color','#444');
      $('#second-driver-log').hide();
      Session.set('whichDriver', $('.first').text());

      console.log('test-log-render');

      


/*        var mileage = DriverOneLogs.find({name: $('.first').text()}).fetch().reverse();
        var count = 0;
        var mileageArr = [];
        mileage.forEach(function (miles) {
          //console.log(count + ": " + miles.mileage);
          count += 1;
          var each = parseFloat(miles.mileage);
          mileageArr.push(each);
          console.log(each);

          for (var i = 0, sum = 0; i < mileageArr.length; sum += mileageArr[i++]) {
          //console.log(count + ' ' + sum);
        
          }
        //console.log(mileageArr.length);
        console.log(sum);
        Session.set('totalMileage', sum);
        });
*/
    }

  //ADDLOG *** HELPERS
  Template.addlog.helpers({
    whichDriver: function() {
      return Session.get('whichDriver');
    },
    today: function() {
      var date = new Date();
      return date;
    }
  });

  //ADDLOG *** EVENTS
  Template.addlog.events({
    'click #back-to-logs': function() {
      Router.go('/logbook');
    },
    'click #add-log-btn': function() {
      
      var whichDriver = Profile.findOne({userID: Meteor.userId()});
      
      //console.log(whichDriver.firstDriver);
      //console.log($('#driver-name-text').text());
      //console.log($('#driver-name-text').text() == whichDriver.firstDriver);
      //console.log(Session.get('getDateInput'))

      if ($('#driver-name-text').text() == whichDriver.firstDriver) {
        Meteor.call('insertDriverOneLog', Meteor.userId(), Session.get('getDriverName'), Session.get('getDateInput'), Session.get('getMileageInput'), Session.get('getDrivingInput'), Session.get('getOnDutyInput'), Session.get('getIsOffInput'));
      } else { 
        Meteor.call('insertDriverTwoLog', Meteor.userId(), Session.get('getDriverName'), Session.get('getDateInput'), Session.get('getMileageInput'), Session.get('getDrivingInput'), Session.get('getOnDutyInput'), Session.get('getIsOffInput'))
      }

      //Meteor.userId()
      //addlog-mileage-input
      //addlog-driving-input
      //addlog-onduty-input
      //addlog-isoff-input

    },
    'keyup #addlog-date-input': function() {
      Session.set('getDateInput', $('#addlog-date-input').val())
    },
    'keyup #addlog-mileage-input': function() {
      Session.set('getMileageInput', $('#addlog-mileage-input').val())
    },
    'keyup #addlog-driving-input': function() {
      Session.set('getDrivingInput', $('#addlog-driving-input').val())
    },
    'keyup #addlog-onduty-input': function() {
      Session.set('getOnDutyInput', $('#addlog-onduty-input').val())
    },
    'keyup #addlog-isoff-input': function() {
      Session.set('getIsOffInput', $('#addlog-isoff-input').val())
    }
  });

  //ADDLOG *** RENDER
  Template.addlog.rendered = function() {

    Meteor.subscribe('showDriverOneLogs');
    Meteor.subscribe('showDriverTwoLogs');

    var d = new Date(),
        month = d.getMonth(),
        day = d.getDay(),
        date = month + '/' + day;
    $('#addlog-date-input').val(date);

    Session.set('getDriverName', $('#driver-name-text').text());
    Session.set('getDateInput', $('#addlog-date-input').val());
    Session.set('getMileageInput', $('#addlog-mileage-input').val());
    Session.set('getDrivingInput', $('#addlog-driving-input').val());
    Session.set('getOnDutyInput', $('#addlog-onduty-input').val());
    Session.set('getIsOffInput', $('#addlog-isoff-input').val());

    //var totalMileageArr = [];

  };

  //SWIFT *** HELPERS
  Template.swift.helpers({

  });

  //SWIFT *** EVENTS
  Template.swift.events({
    'paste .swift-text-area': function() {
      $('.swift-btn-div').fadeIn('slow');
    },
    'click .swift-clear': function() {
      $('.swift-text-area').val('');
      $('.swift-btn-div').fadeOut('slow');
    }
  });

  //SWIFT *** RENDER
  Template.swift.rendered = function () {
    $('.swift-btn-div').hide();
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
    









