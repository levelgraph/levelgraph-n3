
var level = require("level-test")()
  , graph = require("levelgraph")
  , n3 = require("../")
  , concat = require("concat-stream");

describe("augmented db.joinStream", function() {
  
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

  it("should generate a n3 triple", function(done) {
    db.n3.put(tj, function() {
      var stream = db.joinStream([{
          subject: db.v("s")
        , predicate: "http://example.org/cartoons#smarterThan"
        , object: db.v("o")
      }], { 
        n3: {
            subject: db.v("o")
          , predicate: "http://example.org/cartoons#dumberThan"
          , object: db.v("s")
        }
      });
      
      stream.pipe(concat(function(triples) {
        expect(triples).to.eql("<http://example.org/cartoons#Tom> <http://example.org/cartoons#dumberThan> <http://example.org/cartoons#Jerry> .\n");
        done();
      }));
    });
  });
});
