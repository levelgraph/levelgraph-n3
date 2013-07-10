
var Transform = require("stream").Transform;

function TriplesToN3Stream(options) {
  if (!(this instanceof TriplesToN3Stream)) {
    return new TriplesToN3Stream(options);
  }

  options = options || {};

  options.objectMode = true;

  Transform.call(this, options);

}

TriplesToN3Stream.prototype = Object.create(
  Transform.prototype,
  { constructor: { value: TriplesToN3Stream } }
);

TriplesToN3Stream.prototype._transform = function(triple, encoding, done) {

  var key;

  if (this.lastSubject !== triple.subject) {
    if (this.lastSubject) {
      this.push(".\n", "utf8");
    }
    write(this, triple.subject);
  } else {
    this.push(";\n    ", "utf8");
  }

  if (triple.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
    this.push("a ", "utf8");
  } else {
    write(this, triple.predicate);
  }

  write(this, triple.object);

  this.lastSubject = triple.subject;

  done();
};

TriplesToN3Stream.prototype._flush = function(callback) {
  this.push(".\n", "utf8");
  callback();
};

function write(dest, value) {
  dest.push("<", "utf8");
  dest.push(value, "utf8");
  dest.push("> ", "utf8");
}

module.exports = TriplesToN3Stream;
