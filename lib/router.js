Router.configure({layoutTemplate: 'layout'});




Router.route('/', function() {
  // set the layout programmatically
  this.render('landing');
  });

  Router.route('/calc', function() {
    this.render('calc');
  });

  Router.route('/signin', function() {
    this.render('sign_in');
  });

   Router.route('/results', function() {
    this.render('results');
  });

  Router.route('/weather', function() {
    this.render('weather');
  });

  Router.route('/saved', function() {
    this.render('saved');
  });

  Router.route('/logbook', function() {
    this.render('logbook');
  });

