'use strict';
var original = require('./Cloudify4node');
//var conf = require('../backend/appConf');

function Cloudify4node(/*options*/) {}
module.exports = Cloudify4node;



function createRequest(filename) {
    return require('./mock/' + filename + '.json');
}

//function requestWrapper(){
//    return createRequest();
//}

function getMock(filename){
    return function() {
        var callback = arguments[arguments.length - 1];
        return callback(null, createRequest(filename));
    };
}

for ( var i in original ) {
    Cloudify4node[i] =  getMock(i);
}