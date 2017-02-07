var fs       = require('fs'),
    level    = require('memdb'),
    graph    = require('levelgraph'),
    n3   = require('../');

var getDB = function(opts) {
  return n3(graph(level()));
};

module.exports.getDB = getDB;
