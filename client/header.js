Template.header.helpers({
  getUserList: function() {
    var availableUsers = [];
    var user = Session.get('user');
    var userColor = '';

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

    // Check if the user object has a colour property
    if (
      user instanceof Object &&
      user.hasOwnProperty('color')
    ) {
      userColor = humanColour( user.color );

      // Find the users colour and make them first on the list
      for (var i in availableUsers) {

        // Make the user first in our list
        if (userColor == availableUsers[i].colour) {

          // Move the user to the top of the list so that they are first
          availableUsers.splice(0, 0, availableUsers.splice(i, 1)[0]);
        }
      }
    }

    return availableUsers;
  }
});
