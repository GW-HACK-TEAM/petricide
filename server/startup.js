Meteor.startup(function () {
  console.log('');
  console.log('############################################');
  console.log('#####   PETRICIDE   #####');
  console.log('#   #');
  console.log('  #');
  console.log('#   #');
  console.log('############################################');
  GameData.remove({});
  PlayerSlots.remove({});
  PlayerSlots.insert({
    id:1,
    color:'green'
  });
  PlayerSlots.insert({
    id:1,
    color:'red'
  });
  PlayerSlots.insert({
    id:1,
    color:'blue'
  });
});