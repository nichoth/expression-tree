var Facet = require('./Facet'),
    assign = require('object-assign'),
    intersect = require('intersect');

module.exports = OpNode;

var _addChildren = function(left, right) {
  this.left = left;
  this.right = right;
  var context = this;

  // listen for events
  this.left.on('destroy', function(survivor) {
    context._onLeftDestroy(survivor);
  });
  this.right.on('destroy', function(survivor) {
    context._onRightDestroy(survivor);
  });
};

var EVENTS = {
  destroy: 'destroy',
  change: 'change',
};

/**
 * OpNode
 * An operation in a binary expression tree
 */
function OpNode(op, left, right) {
  this._op = op;
  this._resultSet = false;
  _addChildren.call(this, left, right);
}

OpNode.prototype = new Facet();

assign(OpNode.prototype, {
  _listenTo: function(node, direction) {
    var context = this;
    node.on('destroy', function(survivor) {
      context._onChildDestroy(direction, survivor);
    });
    node.on('change', function() {
      context.refresh();
    });
  },

  // remove the child node, replace it with survivor if given
  // if no survivor, destroy this node and pass the other child up
  _onChildDestroy: function(direction, survivor) {
    if (survivor) {
      this[direction] = survivor;
      this._listenTo(this[direction], direction);
      this.refresh();
    } else {
      this[direction] = null;
      survivor = this.left || this.right;
      this.destroy(survivor);
    }
  },

  refresh: function() {
    this._resultSet = this[this._op](this.left, this.right);
    this.emit('change');
  },

  _onLeftDestroy: function(survivor) {
    this._onChildDestroy('left', survivor);
  },

  _onRightDestroy: function(survivor) {
    this._onChildDestroy('right', survivor);
  },

  _onChildChange: function(child) {
    this.refresh();
  },

  results: function() {
    if (this._resultSet) { return this._resultSet; }
    else {
      this._resultSet = this[this._op];
      return this._resultSet;
    }
  },

  intersect: function() {
    return intersect( this.left.results(), this.right.results() );
  },

});
