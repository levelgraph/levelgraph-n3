var helper = require('./helper');

describe("n3.get", function() {

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
      db.n3.get({
        subject: "http://example.org/cartoons#tom"
      }, function(err, triples) {
        expect(triples).to.eql("<http://example.org/cartoons#tom> <http://example.org/cartoons#dumberthan> <http://example.org/cartoons#jerry>.\n");
        done();
      });
    });
  });

  it("should convert 'rdf-type' to 'a'", function(done) {
    db.put({
        subject: "http://example.org/cartoons#tom"
      , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      , object: "http://example.org/cartoons#cat"
    }, function() {
      db.n3.get({
        subject: "http://example.org/cartoons#tom"
      }, function(err, triples) {
        var expected = "<http://example.org/cartoons#tom> a <http://example.org/cartoons#cat>.\n";
        expect(triples).to.eql(expected);
        done();
      });
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
      db.n3.get({
        subject: "http://example.org/cartoons#Tom"
      }, function(err, triples) {
        var expected = "" +
          "<http://example.org/cartoons#Tom> <http://example.org/cartoons#dumberThan> <http://example.org/cartoons#Jerry>;\n" + 
          "    a <http://example.org/cartoons#cat>.\n";
        expect(triples).to.eql(expected);
        done();
      });
    });
  });

  it("should encode literals", function(done) {
    db.put({
        subject: "http://example.org/cartoons#tom"
      , predicate: "http://example.org/cartoons#tall"
      , object: "\"22\""
    }, function() {
      db.n3.get({
        subject: "http://example.org/cartoons#tom"
      }, function(err, triples) {
        var expected = "<http://example.org/cartoons#tom> <http://example.org/cartoons#tall> \"22\".\n"
        expect(triples).to.eql(expected);
        done();
      });
    });
  });

  it("should encode literals without quotes as IRI", function(done) {
    db.put({
        subject: "http://example.org/cartoons#tom"
      , predicate: "http://example.org/cartoons#tall"
      , object: "22"
    }, function() {
      db.n3.get({
        subject: "http://example.org/cartoons#tom"
      }, function(err, triples) {
        var expected = "<http://example.org/cartoons#tom> <http://example.org/cartoons#tall> <22>.\n"
        expect(triples).to.eql(expected);
        done();
      });
    });
  });
});
