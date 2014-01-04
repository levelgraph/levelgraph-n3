var helper = require('./helper');

describe("n3.put", function() {
  
  var db
    , tj = "@prefix c: <http://example.org/cartoons#>.\n" +
           "c:Tom a c:Cat.\n" +
           "c:Jerry a c:Mouse;\n" +
           "        c:smarterThan c:Tom;\n" +
           "        c:place \"fantasy\".";


  beforeEach(function() {
    db = helper.getDB();
  }); 

  afterEach(function(done) {
    db.close(done);
  });

  it("should accept a done callback", function(done) {
    db.n3.put(tj, done);
  });

  it("should store a triple", function(done) {
    db.n3.put(tj, function() {
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

  it("should store three triples", function(done) {
    db.n3.put(tj, function() {
      db.get({
          subject: "http://example.org/cartoons#Jerry"
      }, function(err, triples) {
        expect(triples).to.have.property("length", 3);
        done();
      });
    });
  });
});
