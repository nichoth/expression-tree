var Facet = require('./Facet'),
    assign = require('object-assign');

module.exports = LeafNode;

function LeafNode(set) {
  this._resultSet = set;
}

LeafNode.prototype = new Facet();

assign(LeafNode.prototype, {
  results: function() {
    return this._resultSet;
  }
});
