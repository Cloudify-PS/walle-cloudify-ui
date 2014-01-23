var original = require('./Cloudify4node');
//var fs = require('fs');
var conf = require("../backend/appConf");
//var log4js = require('log4js');
//log4js.configure({
//    appenders: [
//        { type: 'console' },
//        { type: 'file', filename: 'logs/gsui.log', category: 'gsui' }
//    ]
//});

module.exports = Cloudify4node;

function Cloudify4node(options) {}

function createRequest(filename) {
    return require('./mock/' + filename + '.json');
}

function requestWrapper(){
    return createRequest()
}

function getMock( filename ){
    return function() {
        console.log(["I got some arguments", arguments]);
        var callback = arguments[arguments.length - 1];
        return createRequest(filename);
    }
}

for ( var i in original ){
    Cloudify4node[i] =  getMock(i);
}