Meteor.methods({

  addEvent:function(payload){
    console.log(payload);
    if(payload){
      GameData.insert({user:payload.user,clicks:payload.clicks});
    } else {
      console.error('no data');
    }
  },
  newUser: function(){
    var slots = PlayerSlots.find({}).fetch();
    console.log(slots);
    if(slots.length > 0){
      var select = _.first(slots);
      var response = {
        id: Random.id(),
        color: select.color,
        validPlayer: true
      };
      PlayerSlots.remove({_id:select._id});
      return response;
    } else {
      //Router.go('nope');
    }
  }
});
