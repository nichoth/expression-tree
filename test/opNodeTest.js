var Filter = require('../TreeFilter');
var Node = require('../lib/Node');
var OpNode = require('../lib/OpNode');
var test = require('tape');
var EventEmitter = require('events').EventEmitter;

var Fixture = {
  set1: ['one', 'two', 'three'],
  set2: ['two', 'three', 'four'],
};

var set1 = Fixture.set1,
    set2 = Fixture.set2;

// mock leaf nodes
var fac1;
var fac2;

var initMocks = function() {
  fac1 = new EventEmitter();
  fac2 = new EventEmitter();
  fac1.results = function() { return Fixture.set1; };
  fac2.results = function() { return Fixture.set2; };
};

test('Intersect works', function (t) {
  t.plan(1);
  initMocks();
  var opNode = new OpNode('intersect', fac1, fac2);
  t.deepEqual(opNode.intersect(set1, set2), ['two', 'three']);
});

test('Union works', function(t) {
  t.plan(1);
  initMocks();
  var opNode = new OpNode('union', fac1, fac2);
  t.deepEqual(opNode.union(set1, set2), ['one', 'two', 'three', 'four']);
});

test('_onChildDestroy() removes child if there are no survivors', function(t) {
  t.plan(1);
  initMocks();
  var opNode = new OpNode('intersect', fac1, fac2);
  fac1.emit('destroy');
  t.notOk(opNode.left);
});
