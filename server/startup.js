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



});