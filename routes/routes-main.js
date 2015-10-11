/*
 * Routes: Public
 * Routes that are visible to all (public) users.
 */

Router.route('/', {
  path: '/',
  name:'Petricide',
  template: 'app',
  onBeforeAction: function() {
    Session.set('currentRoute', 'app');
    this.next();
  }
});


Router.route('404', {
  path: '/nope',
  name:'nope',
  template: 'nope',
  onBeforeAction: function() {
    Session.set('currentRoute', '404');
    this.next();
  }
});


Router.route('about', {
  path: '/about',
  name:'About',
  template: 'about',
  onBeforeAction: function() {
    Session.set('currentRoute', 'about');
    this.next();
  }
});

