var helper = require('./helper'),
    concat = require('concat-stream');

describe("n3.getStream", function() {

  var db;

  beforeEach(function() {
    db = helper.getDB();
  });

  afterEach(function(done) {
    db.close(done);
  });

  it("should convert a single triple into n3", function(done) {
    db.put({
        subject: "http://example.org/cartoons#tom"
      , predicate: "http://example.org/cartoons#dumberthan"
      , object: "http://example.org/cartoons#jerry"
    }, function() {
      var stream = db.n3.getStream({
                     subject: "http://example.org/cartoons#tom"
                   });

      stream.pipe(concat({ encoding: 'string' }, function(triples) {
        expect(triples).to.eql("<http://example.org/cartoons#tom> <http://example.org/cartoons#dumberthan> <http://example.org/cartoons#jerry>.\n");
        done();
      }));
    });
  });

  it("should convert two triples into N3, reusing the subject", function(done) {
    db.put([{
        subject: "http://example.org/cartoons#Tom"
      , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      , object: "http://example.org/cartoons#cat"
    }, {
        subject: "http://example.org/cartoons#Tom"
      , predicate: "http://example.org/cartoons#dumberThan"
      , object: "http://example.org/cartoons#Jerry"
    }], function() {
      var stream = db.n3.getStream({
                     subject: "http://example.org/cartoons#Tom"
                   });

      stream.pipe(concat({ encoding: 'string' }, function(triples) {
        var expected = "" +
          "<http://example.org/cartoons#Tom> <http://example.org/cartoons#dumberThan> <http://example.org/cartoons#Jerry>;\n" + 
          "    a <http://example.org/cartoons#cat>.\n";
        expect(triples).to.eql(expected);
        done();
      }));
    });
  });
});
