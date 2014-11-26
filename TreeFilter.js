/**
 * FilterModule.js
 * Container for a binary tree of FilterFacets. Maps events to methods.
 */


$.bookmark.FilterModule = function(getFn) {
  if (!catalog) {throw new Error ('need more parameters');}
  this.getFn = getFn;
  this.root = false;
};

_($.bookmark.FilterModule.prototype).extend(Backbone.Events, {

  /**
   * Add a facet to the filter tree.
   * @param {String} op    'intersect' | 'union' | 'difference'. Defaults to
   *                       'intersect'.
   * @param {Object} query Object like { field: <model>, value: <model> },
   *                       where fields and values are observable.
   */
  addQuery: function (query, op) {
    if (this.root) {
      var newRoot = new $.bookmark.FilterFacet(this.getFn, {op: op || 'intersect'});
      newRoot.left = this.root;
      newRoot.right = new $.bookmark.FilterFacet(this.catalog, {query: query});
      this.root = newRoot;
    } else {
      this.root = new $.bookmark.FilterFacet(this.catalog, {query: query});
    }

    this.trigger('queryChange', this);
    this.listenTo(this.root, 'destroy', this.onDestroy);
    return this;
  },

  hasPossibilites: function (query) {
    if (this.root) {
      return this.root.intersect( this.catalog.get(query) ).length > 0;
    } else {
      return true;
    }

  },

  onDestroy: function(survivor) {
    if (survivor) {
      this.stopListening(this.root);
      this.root = survivor;
      this.listenTo(this.root, 'destroy', this.onDestroy);
      this.trigger('queryChange');
    } else {
      this.root = false;
      this.trigger('queryChange');
    }
  },

  results: function() {
    return (this.root) ? this.root.results() : this.catalog.nodeList.models;
  }

});
