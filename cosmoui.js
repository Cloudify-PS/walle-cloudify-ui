#!/usr/bin/env node
process.env.NODE_ENV = 'production';
var log4js = require('log4js');
var logger = log4js.getLogger('server');

if (process.argv[2] !== undefined) {
    logger.debug("in command line");
    var conf = null;

    try{
        conf = require("./backend/appConf");
    }catch(e){}

    logger.debug("after command line");

    var preset = require(__dirname + '/backend/gsPresets.json')[process.argv[2]];
    conf.applyConfiguration(preset);
}

require("./server.js");