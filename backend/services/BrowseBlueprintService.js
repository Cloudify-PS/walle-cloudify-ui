'use strict';

var conf = require('../appConf');
var request = require('request');
var fs = require('fs.extra');
var path = require('path');
var logger = require('log4js').getLogger('BrowseBlueprintService');
var _ = require('lodash');
var unzip = require('unzip');
var Decompress = require('decompress');



module.exports.walkBlueprint = function (  id, last_update, callbackFn){
    if(id.indexOf('.') !== -1 || id.indexOf('/') !== -1) {
        var err = new Error('Blueprint ID can\'t contain spacial characters.');
        return callbackFn(err);
    }
    var walker = new this.Walker();
    walker.walk(path.join(conf.browseBlueprint.path, id, last_update), callbackFn);
};



module.exports.deleteBlueprint = function(id, callbackFn) {
    function removeFile(id, callbackFn) {
        fs.exists(path.join(conf.browseBlueprint.path, id + '.archive'), function (exists){
            if(exists) {
                fs.remove(path.join(conf.browseBlueprint.path, id + '.archive'), function(err){
                    if(err) {
                        return callbackFn(err);
                    }
                    return callbackFn(null);
                });
            }
            else {
                return callbackFn(null);
            }
        });
    }

    function removeFolder(id, callbackFn) {
        fs.exists(path.join(conf.browseBlueprint.path, id), function (exists){
            if(exists) {
                fs.rmrf(path.join(conf.browseBlueprint.path, id), function(err){
                    if(err) {
                        return callbackFn(err);
                    }
                    return callbackFn(null);
                });
            }
            else {
                return callbackFn(null);
            }
        });
    }

    return removeFile(id, function(err){
        if(err === null) {
            return removeFolder(id, callbackFn);
        }
    });
};

module.exports.Walker = function() {
    var _finalCallback = null;
    var root = { 'name': 'root', 'children': []};
    var origRoot;
    var counter = 0;

    function isUnixHiddenPath(path) {
        return (/(^|.\/)\.+[^\/\.]/g).test(path);
    }

    function addChild(rootFolder, children, file) {
        fs.stat(path.join(rootFolder, file), function (err, result) {
            if (result === undefined || result.isSymbolicLink() || isUnixHiddenPath(file)) {
                counter--;
                doFinalCallback();
            } else if (result.isDirectory()) {
                var newItem = {
                    'name': file,
                    'children': []
                };
                children.push(newItem);
                walkFolder(path.join(rootFolder, file), newItem.children);
                counter--;
                doFinalCallback();
            } else {
                fileIsAscii(path.join(rootFolder, file), function(err, isAscii){
                    children.push({
                        'name': file,
                        'relativePath': path.relative(origRoot, path.join(rootFolder, file)),
                        'path': path.join(rootFolder, file),
                        'encoding': isAscii ? 'ASCII' : 'BINARY'
                    });

                    counter--;
                    doFinalCallback();
                });
            }
        });
    }

    function doFinalCallback(err) {
        if (err) {
            _finalCallback({message: 'Error browsing blueprint files', errCode: 'browseError'}, null);
        }
        if (counter === 0) {
            _finalCallback(null, root);
        }
    }

    function walkFolder(rootFolder, _list) {
        logger.trace('walkFolder', rootFolder);
        counter++;
        fs.readdir(rootFolder, function (err, files) {
            if ( !!err ){
                logger.error('unable to walk folder', err);
            }
            if (files.length === 0) {
                doFinalCallback(true);
            }
            counter += files.length;
            counter--;
            for (var i in files) {
                if(files.hasOwnProperty(i)) {
                    addChild(rootFolder, _list, files[i]);
                }
                else{
                    counter--;
                }
            }
        });
    }

    function fileIsAscii(filename, callback) {
        require('fs').readFile(filename, function(err, buf) {
            if (!!err) {
                throw err;
            }
            var isAscii = true;
            for (var i=0, len=buf.length; i<len; i++) {
                if (buf[i] > 127) { isAscii=false; break; }
            }
            callback(null, isAscii);
        });
    }

    this.walk = function (rootFolder, callback) {
        _finalCallback = callback;
        origRoot = path.resolve(rootFolder);
        walkFolder(rootFolder, root.children);
    };

};


/**
 * We assume we know the type of compression beforehand by some ridiculous convention
 * @param {string} type - the type of compression. one of tar,tar.gz, tgz, zip. (gzip is not meant for directories and hence not used here: http://unix.stackexchange.com/questions/93139/can-i-zip-an-entire-folder-using-gzip )
 * @param path - location of compressed file
 * @param dest - destination folder for extraction
 */
exports.extractArchive = function  ( type, path, dest, callback ){
    logger.debug('extracting', type, path,dest);
    if ( !callback ){
        callback = function(){};
    }
    try{

        var decompress = new Decompress()
            .src(path)
            .dest(dest);
        if ( ['tar.gz','tgz'].indexOf(type) >= 0 ) {
            decompress.use(Decompress.targz());
        } else if ( type === 'tar' ){
            decompress.use(Decompress.tar());
        }  else if ( type === 'zip' ){

            fs.createReadStream(path).pipe(unzip.Extract({ path: dest })).on('close',callback);
            return; // FIX CFY-3772.. Decompress-unzip has a bug.. THIS DOES NOT REPRODUCE IN UNIT TESTS BUT IT DOES AT RUNTIME!
            //decompress.use(Decompress.zip());
        } else if (type === 'tar.bz2' ){
            decompress.use(Decompress.tarbz2());
        }else {
            callback(new Error('unknown compression type [' + type + ']'));
        }
        decompress.run(callback);

    }catch(e){
        callback(e);
    }
};

function normalizeExtension( filename ){ //
    return _.find([ 'tar.bz2','tar.gz','tgz','tar','zip'], function( type ){
        return _.endsWith(filename, type);
    });
}


exports.downloadBlueprint = function( cloudifyClientConf, blueprint_id, last_update, callback) {

    function alreadyExists( name ){
        return function(e) {
            logger.debug('folder' + name + ' already exist :: ', e);
        };
    }

    fs.exists(conf.browseBlueprint.path, function (exists) {
        if (!exists) {
            var pathParts = conf.browseBlueprint.path.split('/');
            var pathToCreate = '';
            for (var i = 0; i < pathParts.length; i++) {
                pathToCreate += pathParts[i] + '/';
                fs.mkdir(pathToCreate, alreadyExists(pathParts[i]));
            }
        }

        var requestDetails = {
            url: require('url').resolve(conf.cloudifyManagerEndpoint,'blueprints/' + blueprint_id + '/archive'),
            method: 'GET',
            auth: cloudifyClientConf.authHeader
        };

        console.log('this is requestDetails', requestDetails );

        var stream = request(requestDetails);
        stream.on('response',function(res){
            var extension = normalizeExtension(res.headers['content-disposition']); // e.g. : 'content-disposition': 'attachment; filename=foo.tar',===> we want the extension

            var filepath = path.join(conf.browseBlueprint.path, blueprint_id + '.' + extension);
            var file = fs.createWriteStream(filepath);

            res.pipe(file);
            file.on('close', function(){
                logger.info('extract');
                // allow stream to close;
                setTimeout(function(){ exports.extractArchive( extension, filepath, path.join(conf.browseBlueprint.path , blueprint_id , last_update ), callback ); }, 0);

            });
        });

        stream.on('error', function(e) {
            logger.info('[stream] problem with request: ' + e.message);
            callback(e.message, null);
        });
    });
};



exports.browseBlueprint = function( cloudifyConfig, blueprint_id, last_update, callback) {
    logger.trace('browsing blueprint', blueprint_id);
    exports.downloadBlueprint(cloudifyConfig, blueprint_id, last_update, function (err) {
        if (err) {
            callback({e: err, errCode: 'browseError'}, null);
        } else {
            exports.walkBlueprint(blueprint_id, last_update, callback);
        }
    });
};

exports.browseBlueprintFile = function(blueprint_id, relativePath, callback) {
    fs.readFile(path.join(conf.browseBlueprint.path, blueprint_id, relativePath), 'utf-8', callback);
};
