var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

/**
 * Node
 * A node in a binary tree.
 */
module.exports = Node;

function Node() {

}

assign(Node.prototype, EventEmitter.prototype, {

  destroy: function(survivor) {
    this.emit('destroy', survivor);
    this.removeAllListeners();
  },

  results: function() {
    throw Error('need to override');
  },

});
