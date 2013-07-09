
var n3 = require("n3")
  , PassThrough = require("stream").PassThrough;

function levelgraphN3(graphdb) {
  
  if (graphdb.n3) {
    return graphdb;
  }

  graphdb.n3 = {};

  graphdb.n3.put = function(data, done) {
    var parser = new n3.Parser()
      , putStream = graphdb.putStream()
      , inStream = data;

    putStream.on("finish", done);

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
