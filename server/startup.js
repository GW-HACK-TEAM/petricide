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
  Meteor.setInterval(function(){
    console.log('test');
  }, 1000);
});