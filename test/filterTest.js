var Filter = require('../TreeFilter');
var Node = require('../lib/Node');
var OpNode = require('../lib/OpNode');
var LeafNode = require('../lib/LeafNode');
var test = require('tape');
var EventEmitter = require('events').EventEmitter;

var Fixture = {
  set1: ['one', 'two', 'three'],
  set2: ['two', 'three', 'four'],
};

// mock leaf nodes
var fac1;
var fac2;

var initMocks = function() {
  fac1 = new EventEmitter();
  fac2 = new EventEmitter();
  fac1.results = function() { return Fixture.set1; };
  fac2.results = function() { return Fixture.set2; };
};

test('Filter can construct without arguments', function(t) {
  t.plan(2);
  var filter = new Filter();
  t.ok(filter, 'Filter exists.');
  t.equal(filter.results(), false, 'root is false');
});

test('Filter.add() returns a Node.', function(t) {
  t.plan(1);
  var filter = new Filter();
  var node = filter.add();
  t.is(node instanceof Node, true);
});

test('Filter.getRoot() returns the root node.', function(t) {
  t.plan(1);
  var filter = new Filter();
  var node = filter.add(Fixture.set1);
  t.equal(filter._root, node);
});

test('Adding a second node to the filter creates an opNode as the root', function(t) {
  t.plan(1);
  var filter = new Filter();
  filter.add(Fixture.set1);
  filter.add(Fixture.set2);
  t.is(filter._root instanceof OpNode, true, 'root is opNode');
});

test('Tree is empty after "destroy" event on a single-node expression', function(t) {
  t.plan(2);
  var filter = new Filter();

  facet = filter.add(Fixture.set1);  // create tree with single node
  t.deepEqual(filter.results(), facet.results());

  facet.emit('destroy');
  t.is(filter.results(), false, 'results() returns false after destroy event');
});
