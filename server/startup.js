Meteor.startup(function () {
  console.log('');
  console.log('############################################');
  console.log('#####   PETRICIDE   #####');
  console.log('#   #');
  console.log('  #');
  console.log('#   #');
  console.log('############################################');
  GameData.remove({});
  GameData.insert({sampledata:'sampletestdata'});
});