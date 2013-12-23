#!/usr/bin/env node
var conf = require("./backend/appConf");

if (process.argv[2] !== undefined) {
    var preset = require(__dirname + '/backend/gsPresets.json')[process.argv[2]];
    conf.applyConfiguration(preset);
}

require("./server.js");