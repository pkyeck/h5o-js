var utils = require("./utils");

function sectionHeadingText(section) {

  if (section.heading.implied) {
    return "Untitled " + utils.getTagName(section.startingNode) + "\n";
  }

  var elHeading = utils.getRankingHeadingElement(section.heading);
  if (!elHeading) {
    return "Error: no H1-H6 inside HGROUP" + "\n";
  }

  var textContent = elHeading.textContent;
  if (!textContent) {
    return "No text content inside " + utils.getTagName(elHeading) + "\n";
  }

  return utils.escapeHtml(textContent);
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

function asText(sections, options) {

  if (typeof(options) !== "object") {
    // if second argument is not an object - it must be the boolean for `createLinks` (backwards compat)
    options = {
      createLinks: !!options
    };
  }

  if (!sections.length) {
    return "";
  }

  if (options.skipTopHeader) {
    return asHTML(sections[0].sections, {
      skipToHeader: false,
      createLinks: options.createLinks
    });
  }

  if (typeof(options.linkCounter) === "undefined") {
    options.linkCounter = 0;
  }

  var createLinks = !!options.createLinks;
  var result = [];

  result.push("");

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    result.push("  ");
    result.push(sectionHeadingText(section));
    result.push("\n");
    result.push(asText(section.sections, options));
  }

  return result.join("");
}

module.exports = asText;
