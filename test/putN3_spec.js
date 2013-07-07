
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

  it("should expose a putN3 method", function() {
    expect(db.putN3).to.be.a("function");
  });

  describe("putN3", function() {
    it("should accept a done callback", function(done) {
      db.putN3(tj, done);
    });

    it("should store a triple", function(done) {
      db.putN3(tj, function() {
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
