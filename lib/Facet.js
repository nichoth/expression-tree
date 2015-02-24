/**
 * Facet
 * A node in a binary tree
 */

module.exports = Facet;

function Facet(getFn, opts) {

  opts = opts || {};
  this.op = opts.op || false;
  this.query = opts.query || false;
  this.resultSet = false;
  this.left = opts.left || false;
  this.right = opts.right || false;

}
