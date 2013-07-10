
var n3 = require("n3")
  , PassThrough = require("stream").PassThrough
  , triplesToN3 = require("./lib/triplesToN3Stream")
  , concat = require("concat-stream");

function levelgraphN3(graphdb) {
  
  if (graphdb.n3) {
    return graphdb;
  }

  graphdb.n3 = {};

  graphdb.n3.getStream = function(pattern) {
    return graphdb.getStream(pattern).pipe(triplesToN3());
  };

  graphdb.n3.get = function(pattern, callback) {
    var stream = graphdb.n3.getStream(pattern)
      , wrapped = function(result) {
                    callback(null, result);
                  }

    stream.on("error", callback);
    
    return stream.pipe(concat(wrapped));
  };

  graphdb.n3.put = function(data, done) {
    var parser = new n3.Parser()
      , putStream = graphdb.putStream()
      , inStream = data;

    putStream.on("close", done);

    if (typeof inStream === 'string') {
      inStream = new PassThrough();
      inStream.end(data);
    }

    parser.parse(inStream, function(err, triple) {
      if (err) {
        putStream.emit("error", err);
        return;
      }

      if (triple) {
        putStream.write(triple);
      } else {
        putStream.end();
      }
    });
  };
  
  return graphdb;
}

module.exports = levelgraphN3;
