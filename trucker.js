

  

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
    number: function(){
      return Session.get('num');
    }
  });

  Session.setDefault('num', 0);
 
  Template.calc.events({
    'click .check-save': function(){
      console.log('check-save clicked');
    },
    'keyup #speed-input': function(){
      var s = $("#speed-input"), // speed-input
          b = $(".get-btn"), // button
          c = $(".get"); //check

      if (s.val().length != 0){
        b.prop('disabled', false);
        b.css('background-color', '#34bf49');

      } else {
        b.prop('disabled', true);
        c.css('color', '#fff');
      }
    },
    'click .get-btn': function(){
      Session.set('num', Session.get('num') + 1);
    }

  });
}



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