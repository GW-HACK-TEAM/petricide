/*
 * Routes: Public
 * Routes that are visible to all (public) users.
 */

Router.route('404', {
  path: '/nope',
  name:'nope',
  template: 'nope',
  onBeforeAction: function() {
    this.next();
  }
});
