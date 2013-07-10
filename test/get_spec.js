
var level = require("level-test")()
  , graph = require("levelgraph")
  , n3 = require("../");

describe("n3.get", function() {
  
  var db;

  beforeEach(function() {
    db = n3(graph(level()));
  }); 

  afterEach(function(done) {
    db.close(done);
  });

  it("should convert a single triple into N3", function(done) {
    db.put({
        subject: "http://example.org/cartoons#Tom"
      , predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      , object: 'http://example.org/cartoons#cat'
    }, function() {
      db.n3.get({
        subject: "http://example.org/cartoons#Tom"
      }, function(err, triples) {
        expect(triples).to.eql("<http://example.org/cartoons#Tom> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org/cartoons#cat> .\n");
        done();
      });
    });
  });
});
