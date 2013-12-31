#!/usr/bin/env node
process.env.NODE_ENV = 'production';





if (process.argv[2] !== undefined) {
    console.log("in command line");
    var conf = null;

    try{
        conf = require("./backend/appConf");
    }catch(e){}

    console.log("after command line");

    var preset = require(__dirname + '/backend/gsPresets.json')[process.argv[2]];
    conf.applyConfiguration(preset);
}

require("./server.js");