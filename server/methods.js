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
      return false;
    }
  },
  readyCheck:function(){
    var slots = PlayerSlots.find({}).fetch();
    console.log(slots);
    if(slots.length < 4){
      return true;
    } else {
      return false;
    }
  },
  reset:function(){
    console.log('resetting');
    GameData.remove({});
    PlayerSlots.remove({});

    var colors = [
      '#49daf4',
      '#a864a8',
      '#f7941d',
      '#00a99d',
      '#fa504d'
    ];
    var i = 0;
    _.each(colors, function (elem) {
      PlayerSlots.insert({
        id: i++,
        color: elem
      });
    });
  }
});
