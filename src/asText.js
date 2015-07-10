'use strict';

var utils = require('./utils');
var endOfLine = require('os').EOL;


function sectionHeadingText(section) {
  if (section.heading.implied) {
    return '\x1b[31mUntitled ' + utils.getTagName(section.startingNode) + '\x1b[0m';
  }

  var elHeading = utils.getRankingHeadingElement(section.heading);
  if (!elHeading) {
    return '\x1b[31mError: no H1-H6 inside HGROUP\x1b[0m';
  }

  var textContent = elHeading.textContent;
  if (!textContent) {
    return '\x1b[31mNo text content inside ' + utils.getTagName(elHeading) + '\x1b[0m';
  }

  return textContent;
}

function getId(section, options) {
  var sectionId = section.startingNode.getAttribute('id');
  if (sectionId) {
    return sectionId;
  }

  if (!section.heading.implied) {
    var headingId = section.heading.getAttribute('id');
    if (headingId) {
      return headingId;
    }
  }

  var node = section.startingNode;
  do {
    var id = 'h5o-' + (++options.linkCounter);
  } while (node.ownerDocument.getElementById(id));

  node.setAttribute('id', id);
  return id;
}

function asText(sections, options, indent) {
  indent = indent || 0;

  if (typeof(options) !== 'object') {
    // if second argument is not an object - it must be the boolean for `createLinks` (backwards compat)
    options = {createLinks: !!options};
  }

  if (!sections.length) {
    return '';
  }

  if (options.skipTopHeader) {
    return asText(sections[0].sections, {
      skipToHeader: false,
      createLinks: options.createLinks
    });
  }

  if (typeof(options.linkCounter) === 'undefined') {
    options.linkCounter = 0;
  }

  var createLinks = !!options.createLinks;
  var result = [];

  result = '';

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    result += '  ';

    for (var ii = 0; ii < indent * 2; ii++) {
      result += ' ';
    }

    result += i + ' ' + sectionHeadingText(section);
    result += endOfLine;
    result += asText(section.sections, options, indent + 1);
  }

  return result + endOfLine;
}

module.exports = asText;
