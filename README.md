# Tree Filter #
A stateful binary expression tree for set algebra. Nodes in the tree are Node.js EventEmitters, providing granular control of each part of the expression. Nodes representing an *operation* cache their result set, and re-cache their result when their child nodes change.

## Install

    $ npm install tree-filter

## Use

```js
var Filter = require('tree-filter');

var filter = new Filter();
var node = filter.add(['one', 'two', 'three']);
filter.add(['two', 'three', 'four']);
var resultSet = filter.results()
// returns the intersection by default: `['two', 'three']`

filter.remove(node);
filter.results();  // returns `['two', 'three', 'four']`
```

## API ##
### TreeFilter()
Construct an empty expression tree. The tree is an EvenEmitter and emits `'change'` events if the expression changes.

### add(*array* set [*string* operation])
Add the given set to the tree, using `operation`. Operations for now are only `'intersect'`or `'union'`. Operations can be referenced as properties on a filter instance: `filterInstance.ops.intersect`.

**Returns**
*LeafNode* -- the tree node that was created for this set. This is a Node.js EvenEmitter, emitting a `'destroy'` event.


### removeNode(*Node* Node)
Remove the given Node from the tree. A *Node* is an instance of `Node`, returned by calling `TreeFilter.add`. Removing a node will update the results of the expression and emit a `'change'` event on the tree instance.

### results()
Returns the set that results from computing the expression, or `false` if the expression is empty.

**Returns**
*Array*
