var Node = require('./Node'),
    assign = require('object-assign');

module.exports = LeafNode;

function LeafNode(set, queryData) {
  this._resultSet = set;
  this.query = queryData;  // optional ref to the query used to get this data.
}

LeafNode.prototype = new Node();

assign(LeafNode.prototype, {
  results: function() {
    return this._resultSet;
  }
});
