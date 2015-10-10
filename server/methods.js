Meteor.methods({
  testMethod:function(){
    var data = GameData.find({}).fetch();
    console.log(data);
    return data;
  }
});