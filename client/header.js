Template.header.helpers({
  active: function(classname) {
    return 'selected';
  },
  getUserList: function() {
    var availableUsers = [];
    var user = Session.get('user');
    var userColor = humanColour( user.color );

    availableUsers = [
      {
        name: 'Projectmoon',
        colour: 'cyan'
      },
      {
        name: 'Mighty Quinn',
        colour: 'purple'
      },
      {
        name: 'Stackpool',
        colour: 'yellow'
      },
      {
        name: 'Bakeruk',
        colour: 'teal'
      },
      {
        name: 'Donald',
        colour: 'coral'
      }
    ];

    for (var i in availableUsers) {

      // Make the user first in our list
      if (userColor == availableUsers[i].colour) {

        // Move the user to the top of the list so that they are first
        availableUsers.splice(0, 0, availableUsers.splice(i, 1)[0]);
      }
    }

    return availableUsers;
  }
});
