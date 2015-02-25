var EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    LeafNode = require('./lib/LeafNode'),
    OpNode = require('./lib/OpNode');

var _listenTo = function(node, context) {
  node.on('change', function() {
    _onChange(context, argumnets);
  });
  node.on('destroy', function(survivor) {
    _onDestroy(context, survivor);
  });
};

var _replaceRoot = function(tree, newRoot) {
  if (tree._root) {
    tree._root.removeAllListeners();
    tree._root = newRoot;
  } else {
    tree._root = newRoot;
  }

  _listenTo(tree._root, tree);
  tree.emit('change');
};

var _onDestroy = function(tree, survivor) {
  if (survivor) {
    _replaceRoot(tree, survivor);
  } else {
    tree._root = false;
    tree.emit('change');
  }
};

var _onChange = function(tree, node) {

};

/**
 * TreeFilter.js
 * An expression tree for set algebra.
 */
var TreeFilter = function() {
  this._root = false;
};

// static props
assign(TreeFilter, {
  ops: {
    intersect: 'intersect',
    difference: 'difference',
    union: 'union'
  }
});

assign(TreeFilter.prototype, EventEmitter.prototype, {

  ops: TreeFilter.ops,

  add: function(set, op) {
    op = op || this.ops.intersect;
    var leaf = new LeafNode(set);

    if (this._root) { _replaceRoot(this, new OpNode(op, this._root, leaf)); }
    else { _replaceRoot(this, leaf); }

    // return the node containing the set passed in, not the set after op
    return leaf;
  },

  _onDestroy: function(survivor) {

  },

  removeFacet: function(facet) {
    facet.destroy();
  },

  results: function() {
    return (this._root) ? this._root.results() : false;
  }

});

module.exports = TreeFilter;
