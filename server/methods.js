Meteor.methods({
  testMethod:function(payload){
    console.log(payload);
    if(payload){
      GameData.insert({user:payload.user,clicks:payload.clicks});
    } else {
      console.error('no data');
    }
  },
  heartBeat:function(){
    return GameData.find({});
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
