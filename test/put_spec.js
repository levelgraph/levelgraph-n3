
var level = require("level-test")()
  , graph = require("levelgraph")
  , n3 = require("../");

describe("putting n3", function() {
  
  var db
    , tj = "@prefix c: <http://example.org/cartoons#>.\n" +
           "c:Tom a c:Cat.\n" +
           "c:Jerry a c:Mouse;\n" +
           "        c:smarterThan c:Tom.";


  beforeEach(function() {
    db = n3(graph(level()));
  }); 

  afterEach(function(done) {
    db.close(done);
  });

  it("should expose a n3.put method", function() {
    expect(db.n3.put).to.be.a("function");
  });

  describe("n3.put", function() {
    it("should accept a done callback", function(done) {
      db.n3.put(tj, done);
    });

    it("should store a triple", function(done) {
      db.n3.put(tj, function() {
        db.get({
          subject: "http://example.org/cartoons#Tom"
         }, function(err, triple) {
           expect(triple).to.exist;
           done();
         });
      });
    });
  });

});
