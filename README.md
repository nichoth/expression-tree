# Tree Filter #
A stateful binary expression tree for set algebra. Nodes in the tree are event emitters, providing granular control of the expression. Nodes representing an *operation* cache their result set, and re-cache their result if their child nodes change.

## Install

    $ npm install tree-filter

## Use

```js
var Filter = require('tree-filter');

var filter = new Filter();
var facet = filter.add(['one', 'two', 'three']);
filter.add(['two', 'three', 'four']);
var resultSet = filter.results()
// returns the intersection by default: `['two', 'three']`

filter.remove(facet);
filter.results();  // returns `['two', 'three', 'four']`
```

## API ##
### TreeFilter()
Construct an empty expression tree. The tree is an EvenEmitter and emits `'change'` events if expression or result of the expression change.

### add(*array* set [*string* operation])
Add the given set to the tree, using `operation`. Operations for now are only `'intersect'`or `'union'`. Operations can be referenced as properties on a filter instance: `filterInstance.ops.intersect`.

**Returns**
*Facet* LeafNode -- the tree node that was created for this set. This is a Node.js EvenEmitter, emitting a `'destroy'` event.


### removeFacet(*Facet* facet)
Remove the given facet from the tree. A facet is just a tree node. The tree instance will update the result of the expression after a facet is removed.

### results()
Returns the set resulting from computing the expression tree.

**Returns**
*Array* set
