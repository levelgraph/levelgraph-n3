#! /bin/sh

rm -rf build
mkdir build
./node_modules/.bin/browserify -s levelgraphN3 index.js > build/levelgraph-n3.js
./node_modules/.bin/uglifyjs build/levelgraph-n3.js > build/levelgraph-n3.min.js
du -h build/*
