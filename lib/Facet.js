var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

/**
 * Facet
 * A node in a binary tree
 */
module.exports = Facet;

function Facet() {

}

assign(Facet.prototype, EventEmitter.prototype, {

  destroy: function(survivor) {
    this.emit('destroy', survivor);
    this.removeAllListeners();
  },

  results: function() {
    throw Error('need to override');
  },

});
