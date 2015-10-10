Meteor.methods({
  testMethod:function(){
    return GameData.find({}).fetch();
  }
});
