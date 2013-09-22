LevelGraph-N3
===========

![Logo](https://github.com/mcollina/node-levelgraph/raw/master/logo.png)

__LevelGraph-N3__ is a plugin for
[LevelGraph](http://github.com/mcollina/levelgraph) that adds the
ability to store, fetch and process N3 and turtle files.

[![Build
Status](https://travis-ci.org/mcollina/levelgraph-n3.png)](https://travis-ci.org/mcollina/levelgraph-n3)

## Install on Node.js

```
npm install levelgraph levelgraph-n3 --save
```

At the moment it requires node v0.10.x, but the port to node v0.8.x
should be straighforward.
If you need it, just open a pull request.

## Install in the Browser

TO BE DONE!

## Usage

Adding support for N3 to LevelGraph is easy:
```
var levelgraph = require("levelgraph")
  , n3         = require("levelgraph-n3")
  , db         = n3(levelgraph("yourdb"));
```

### Get and Put

Storing an N3 file in the database is extremey easy:
```
var turtle = "@prefix c: <http://example.org/cartoons#>.\n" +
             "c:Tom a c:Cat.\n" +
             "c:Jerry a c:Mouse;\n" +
             "        c:smarterThan c:Tom;\n" +
             "        c:place \"fantasy\".";

db.n3.put(turtle, function(err) {
  // do something after the triple is inserted
});
```

Retrieving it through pattern-matching is extremely easy:
```
db.n3.get({ subject: "http://example.org/cartoons#Tom" }, function(err, turtle) {
  // turtle is "<http://example.org/cartoons#Tom> a <http://example.org/cartoons#Cat> .\n";
});
```

It even support a Stream interface:
```
var stream = kdb.n3.getStream({ subject: "http://example.org/cartoons#Tom" });
stream.on("data", function(data) {
  // data is "<http://example.org/cartoons#Tom> a <http://example.org/cartoons#Cat> .\n";
});
stream.on("end", done);
```

### Exporting NTriples from LevelGraph

__LevelGraph-N3__ allows to export ntriples from a __LevelGraph__ database.
__LevelGraph-N3__ augments the a standard `join` method with a `{ n3: ... }` option
that specifies the subject, predicate and object of the created triples.
It follows the same structure of the `{ materialized: ... }` option (see https://github.com/mcollina/levelgraph#joins).

Here is an example:
```
db.join([{
    subject: db.v("s")
  , predicate: "http://example.org/cartoons#smarterThan"
  , object: db.v("o")
}], { 
  n3: {
      subject: db.v("o")
    , predicate: "http://example.org/cartoons#dumberThan"
    , object: db.v("s")
  }
}, function(err, turtle) {
  // turtle is "<http://example.org/cartoons#Tom> <http://example.org/cartoons#dumberThan> <http://example.org/cartoons#Jerry> .\n"
});
```

It also supported by the `joinStream` method.

## Contributing to LevelGraph-N3

* Check out the latest master to make sure the feature hasn't been
  implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't
  requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it
  in a future version unintentionally.
* Please try not to mess with the Makefile and package.json. If you
  want to have your own version, or is otherwise necessary, that is
  fine, but please isolate to its own commit so I can cherry-pick around
  it.

## LICENSE - "MIT License"

Copyright (c) 2013 Matteo Collina (http://matteocollina.com)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
