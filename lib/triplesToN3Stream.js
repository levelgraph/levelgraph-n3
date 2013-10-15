
var Transform = require("stream").Transform
  , IRI = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i
  , quoteWrapped = /^["'].+["']/;

if (!Transform) {
  Transform = require("readable-stream").Transform;
}

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
    push(this, triple.subject);
  } else {
    this.push(";\n    ", "utf8");
  }

  if (triple.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
    this.push("a ", "utf8");
  } else {
    push(this, triple.predicate);
  }

  push(this, triple.object);

  this.lastSubject = triple.subject;

  done();
};

TriplesToN3Stream.prototype._flush = function(callback) {
  this.push(".\n", "utf8");
  callback();
};

function push(dest, value) {
  if (!value.match) {
    value = "" + value;
  }

  if (value.match(IRI)) {
    dest.push("<", "utf8");
    dest.push(value, "utf8");
    dest.push("> ", "utf8");
  } else if (value.match(quoteWrapped)) {
    dest.push(value, "utf8");
    dest.push(" ", "utf8");
  } else {
    dest.push("\"", "utf8");
    dest.push(value, "utf8");
    dest.push("\" ", "utf8");
  }
}

module.exports = TriplesToN3Stream;
