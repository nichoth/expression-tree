/**
 * FilterFacet.js
 * A node in a binary tree of queries.
 * This caches the results of a query, or caches the results of its op applied
 * to its childrens' results.
 *
 * The cached results are a set of BB Models.
 *
 * Listens to cached models or children for attr changes that affect this's
 * results.
 */


$.bookmark.FilterFacet = function(catalog, opts) {

  this.catalog = catalog;

  this.op = opts.op || false;
  this.query = opts.query || false;
  this.resultSet = false;
  this.left = opts.left || false;
  this.right = opts.right || false;

};

_($.bookmark.FilterFacet.prototype).extend(Backbone.Events, {
  results: function() {
    if (this.resultSet) { return this.resultSet; }
    else {
      if (this.left) {
        // is branch, apply op to child results
        this.resultSet = this.left[this.op]( this.right.results() );
        this.listenTo(this.left, 'destroy', this.onLeftDestroy);
        this.listenTo(this.left, 'change', this.onChildChange);
        this.listenTo(this.right, 'destroy', this.onRightDestroy);
        this.listenTo(this.right, 'change', this.onChildChange);
      } else {
        // is leaf, evaluate query
        this.resultSet = this.catalog.get(this.query);
        // re-cache when the query changes
        this.listenTo(this.query.field, 'some-event', this.results());
        this.listenTo(this.query.value, 'some-event', this.results());
      }
      return this.resultSet;
    }
  },

  toString: function() {
    var val;
    if (this.query) {
      val = this.query.field.id +': '+ this.query.value.get('name');
    } else {
      val = this.op;
    }
    return val;
  },

  onLeftDestroy: function (survivor) {
    if (survivor) {
      this.stopListening(this.left);
      this.left = survivor;
      this.listenTo(this.left, 'destroy', this.onLeftDestroy);
      this.refresh();
    } else {
      this.destroy(this.right);
    }
  },

  onRightDestroy: function (survivor) {
    if (survivor) {
      this.stopListening(this.right);
      this.right = survivor;
      this.listenTo(this.right, 'destroy', this.onRightDestroy);
      this.refresh();
    } else {
      survivor = this.left;
      this.destroy(survivor);
    }
  },

  // re-cache results
  // to-do:
  //    only trigger change if the new results are different
  refresh: function () {
    if (this.left) {
      this.resultSet = this.left[this.op](this.right);
    } else {
      this.resultSet = this.catalog.get(this.query);
    }
    this.trigger('change');
  },

  // re-cache the result set
  onChildChange: function (child) {
    this.refresh();
  },

  destroy: function (survivor) {
    this.trigger('destroy', survivor);
  },

  // ops:
  intersect: function(arr) {
    return _( this.results() ).intersection(arr);
  },
  union: function() {},

  difference: function() {},

});
