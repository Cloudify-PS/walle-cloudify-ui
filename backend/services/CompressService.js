'use strict';

var zlib = require('zlib');
var fs = require('fs');
var conf = require('../../backend/appConf');
var tar = require('tar');
var log4js = require('log4js');
log4js.configure(conf.log4js);
var logger = log4js.getLogger('cloudify4node');

module.exports.extract = function(blueprint_id, last_update, callback) {
    logger.info('extracting with zlib');

    var gunzipWriter = zlib.createGunzip();

    fs.createReadStream(conf.browseBlueprint.path + '/' + blueprint_id + '.archive')
        .pipe( gunzipWriter )
        .pipe(tar.Extract({path: conf.browseBlueprint.path + '/' + blueprint_id + '/' + last_update}))
        .on('error', function (err) {
            logger.info('Error on extract', err);
            callback(err, null);
        })
        .on('end', function () {
            logger.info('zlib extracting done');
            callback(null, null);
        });

    gunzipWriter.on('error', function(e){
        logger.info('gunzip error', e);
        callback({e: e, message: e.message, errCode: e.errCode}, null);
    });
};

module.exports.pack = function(blueprint_id, path, callback) {
    fs.createReadStream(path + '/' + blueprint_id + '.tar.gz')
        .pipe(tar.Pack())
        .pipe(zlib.createGzip())
        .on('end', function() {
            callback(null, null);
        });
};