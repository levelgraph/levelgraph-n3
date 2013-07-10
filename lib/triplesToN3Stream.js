
var Transform = require("stream").Transform;

function TriplesToN3Stream(options) {
  if (!(this instanceof TriplesToN3Stream)) {
    return new TriplesToN3Stream(options);
  }

  options = options || {};

  options.objectMode = true;

  Transform.call(this, options);

  var that = this;
}

TriplesToN3Stream.prototype = Object.create(
  Transform.prototype,
  { constructor: { value: TriplesToN3Stream } }
);

var keys = ["subject", "predicate", "object"];

TriplesToN3Stream.prototype._transform = function(triple, encoding, done) {

  var key
    , that = this;

  keys.forEach(function(key) {
    that.push("<", "utf8");
    that.push(triple[key], "utf8");
    that.push("> ", "utf8");
  });

  this.push(".\n", "utf8");

  done();
};

module.exports = TriplesToN3Stream;
