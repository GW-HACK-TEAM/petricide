/*
 * Coverts a hex code colour to it's human readable name
 *
 * @param {string} colour
 * @return {string}
 */
humanColour = function(colour) {
  var humanColour = '';

  switch (colour) {
    case '#fa504d':
      humanColour = 'coral';
      break;

    case '#49daf4':
      humanColour = 'cyan';
      break;

    case '#1cb1a7':
      humanColour = 'teal';
      break;

    case '#f7941d':
      humanColour = 'yellow';
      break;

    case '#a864a8':
      humanColour = 'purple';
      break;
  }

  return humanColour;
};
