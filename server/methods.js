Meteor.methods({
  testMethod:function(){
      return GameData.find({}).fetch();
  },
  newUser: function(){
    //TODO logic to test availability

    var response = {
      id: Random.id(),
      color: 'purple',
      validPlayer: true
    };
    console.log(response);
    return response;
  }
});