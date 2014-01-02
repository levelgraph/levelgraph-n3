
var n3 = require("n3")
  , concat = require("concat-stream");

function levelgraphN3(db) {
  
  if (db.n3) {
    return db;
  }

  var graphdb = Object.create(db);

  graphdb.n3 = {};

  graphdb.n3.getStream = function(pattern, options) {
    return graphdb.getStream(pattern, options).pipe(new n3.StreamWriter());
  };

  graphdb.n3.get = wrapCallback('getStream');

  graphdb.n3.put = function(data, done) {
    var stream = this.putStream();
    
    stream.on("close", done)
    stream.end(data)

    return this;
  };

  graphdb.n3.putStream = function() {
    var parser = new n3.StreamParser()
      , putStream = graphdb.putStream();

    putStream.on("close", parser.emit.bind(parser, "close"));
    putStream.on("finish", parser.emit.bind(parser, "finish"));
    putStream.on("error", parser.emit.bind(parser, "error"));

    parser.pipe(putStream);

    return parser;
  };

  graphdb.searchStream = function(conditions, options) {
    var stream;

    if (options && options.n3) {
      options.materialized = options.n3;
    }

    stream = db.searchStream(conditions, options);

    if (options && options.n3) {
      stream = stream.pipe(new n3.StreamWriter());
    }

    return stream;
  };

  graphdb.search = function(conditions, options, callback) {
    var stream;

    if (options.n3) {
      stream = this.searchStream(conditions, options)

      stream.pipe(concat({ encoding: 'string' }, function(result) {
        callback(null, result);
      }));

      stream.on("error", callback);

      return this;
    }

    return db.search(conditions, options, callback);
  };

  return graphdb;
}

function wrapCallback(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments, 0)
      , callback = args.pop()
      , stream = null
      , wrapped = function(result) {
                    callback(null, result);
                  };

    stream = this[method].apply(this, args);

    stream.on("error", callback);

    stream.pipe(concat({ encoding: 'string' }, wrapped));
  };
}

module.exports = levelgraphN3;
