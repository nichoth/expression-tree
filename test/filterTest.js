var Filter = require('../TreeFilter');
var Facet = require('../lib/Facet');
var test = require('tape');

test('testing the tests', function (t) {
  t.plan(1);
  t.equal(22, 22);
});

test('Filter can construct without arguments', function(t) {
  t.plan(2);
  var filter = new Filter();
  t.ok(filter, 'Filter exists.');
  t.equal(filter.results(), false, 'root is false');
});

var filter = new Filter();

test('Filter.add() returns a Facet.', function(t) {
  t.plan(1);
  var facet = filter.add();
  t.is(facet instanceof Facet, true);
});
