Router.configure({layoutTemplate: 'layout'});




Router.route('/', function () {
  // set the layout programmatically
  this.render('landing');

  });

  Router.route('/calc', function (){
    this.render('calc');
  });

  Router.route('/signin', function (){
    this.render('sign-in');
  });

   Router.route('/calc-settings', function (){
    this.render('calc-settings');
  });

  Router.route('/weather', function (){
    this.render('weather');
  });

  Router.route('/test', function (){
    this.render('test')
  })

