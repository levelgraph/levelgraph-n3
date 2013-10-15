
var level = require("level-test")()
  , graph = require("levelgraph")
  , n3 = require("../");

describe("n3.putStream", function() {
  
  var db
    , tj = "@prefix c: <http://example.org/cartoons#>.\n" +
           "c:Tom a c:Cat.\n" +
           "c:Jerry a c:Mouse;\n" +
           "        c:smarterThan c:Tom;\n" +
           "        c:place \"fantasy\".";


  beforeEach(function() {
    db = n3(graph(level()));
  }); 

  afterEach(function(done) {
    db.close(done);
  });

  it("should store some triples", function(done) {
    var stream = db.n3.putStream()
    tj.split("\n").forEach(function(line) {
      stream.write(line)
    })
    stream.end()
    stream.on('finish', function() {
      db.get({
          subject: "http://example.org/cartoons#Tom"
        , predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
        , object: 'http://example.org/cartoons#Cat'
      }, function(err, triple) {
        expect(triple).to.exist;
        done();
      });
    });
  });
});
