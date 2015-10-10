Template.header.helpers({
  active: function(classname) {
    return 'selected';
  },
  getUserList: function() {
    var users = [];

    users = [
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

    return users;
  }
});
