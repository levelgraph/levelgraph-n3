var exec = require('child_process').exec
  , fs = require('fs')
  , graph = require('levelgraph')
  , n3 = require('../');

describe("CLI: import n3 file(s)", function() {

  var test_file_path = 'test/fixtures/dbpedia_sample.nt'
    , test_db_path = './import_test_db_0123';

  var import_err
    , import_stdout
    , import_stderr;

  before(function(done) {
    exec('./import.js -q ' + test_file_path + ' -o ' + test_db_path,
      function (err, stdout, stderr) {
        import_err = err;
        import_stdout = stdout;
        import_stderr = stderr;
        done();
    });
  }); 

  after(function(done) {
    exec('rm -r import_test_db_0123',
      function (err, stdout, stderr) {
        if (err) return done(err);
        done();
    });
  });

  it("should not produce errors or output during quiet import", function() {
    expect(import_err).to.be.null;
    expect(import_stdout).to.be.empty;
    expect(import_stderr).to.be.empty;
  });

  it("should create db at specified path", function(done) {
    fs.stat(test_db_path, function (err, stats) {
      expect(stats.isDirectory()).to.be.true;
      done();
    });
  });

  it("should allow triples to then be queried", function(done) {
    var db = n3(graph(test_db_path));
    db.search({
        subject: "http://dbpedia.org/resource/Abraham_Lincoln"
      , predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      , object: db.v('type')
    }, {}, function (err, result) {
      expect(result[0]['type']).to.equal('http://xmlns.com/foaf/0.1/Person');
      done();
    });
  });

});
