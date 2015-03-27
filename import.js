#!/usr/bin/env node

var levelgraph = require('levelgraph')
  , levelgraphN3 = require('./')
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , progressStream = require('progress-stream');

var cli = require('cli')
  .enable('glob');

var options = cli.parse({
  output: ['o', 'Specify output folder', 'path', './db'],
  quiet: ['q', 'Do not show progress information']
});

// create db output folder
try {

  var dbPath, dbCreate;

  dbPath = path.resolve(options.output);
  var checkExt = path.extname(dbPath);
  console.log(checkExt);
  if (checkExt !== '' || checkExt.slice(-1) === '*') {
    console.log('Error: bad output folder specified.')
    process.exit(0);
  }
  
  dbCreate = mkdirp.sync(dbPath);
  if (!dbCreate) {
    if (!options.quiet) console.log('\nExisting LevelGraph database at: ' + dbPath);
  } else {
    if (!options.quiet) console.log('\nLevelGraph database created at: ' + dbPath);
  }

  // initialize levelgraph-n3
  var db = levelgraphN3(levelgraph(dbPath));

} catch (err) {
  console.error(err);
  process.exit(1);
}


try {

  // importing files
  var inputfiles = cli.args.slice(0);

  if (inputfiles.length === 0) {
    console.log('\nNo input file(s) specified.');
    process.exit(0);
  } else {
    if(!options.quiet) console.log('\nNumber of files to be imported: ' + inputfiles.length.toString());
  }

  inputfiles.forEach(function(filepath) {

    // normalize and resolve given file path
    var n3file = path.resolve(filepath);

    // must be .nt or .n3 file
    if (path.extname(n3file) !== '.nt' && path.extname(n3file) !== 'n3') {
      console.log('Invalid file. Must be .nt or n3 file.');
    } else {
    
      if (!options.quiet) console.log('\nImporting RDF N-triple file: ' + n3file);

      var fileStats = fs.statSync(n3file);
      var progstr = progressStream({
        length: fileStats.size,
        time: 1000
      }).on('progress', function(progress) {
        if(!options.quiet) {
          console.log(progress);
        }
      });

      var stream = fs.createReadStream(n3file)
        .pipe(progstr)
        .on('finish', function() {
          if (!options.quiet) {
            console.log('\nImport of ' + path.basename(n3file) + ' completed.\n');
          }
        })
        .pipe(db.n3.putStream());

    }

  });

} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  if (!options.quiet) console.log('\nAll files imported to levelgraph-n3 database at: ' + dbPath + '\n');
}
