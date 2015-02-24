var EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    Facet = require('./lib/Facet');

/**
 * TreeFilter.js
 * An expression tree for set algebra.
 */
var TreeFilter = function(opts) {
  opts = opts || {};
  this._Facet = opts.constructor || Facet;
  this._root = false;
};

assign(TreeFilter.prototype, EventEmitter.prototype, {

  add: function(set, op) {
    return new Facet();
  },

  removeFacet: function(facet) {
    facet.destroy();
  },

  results: function() {
    return (this._root) ? this._root.results() : false;
  }

});

module.exports = TreeFilter;
