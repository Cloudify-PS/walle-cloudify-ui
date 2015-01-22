'use strict';

var conf = require('../appConf');
var fs = require('fs.extra');
var path = require('path');

module.exports.isBlueprintExist = function (id, callbackFn) {
    fs.exists(path.join(conf.browseBlueprint.path, id), function (exists){
        callbackFn(null, exists);
    });
};

module.exports.browseBlueprint = function (id, last_update, callbackFn){
    if(id.indexOf('.') !== -1 || id.indexOf('/') !== -1) {
        var err = new Error('Blueprint ID can\'t contain spacial characters.');
        return callbackFn(err);
    }
    var walker = new this.Walker();
    walker.walk(path.join(conf.browseBlueprint.path, id, last_update), callbackFn);
};

module.exports.fileGetContent = function(id, relativePath, callbackFn) {
    fs.readFile(path.join(conf.browseBlueprint.path, id, relativePath), 'utf-8', callbackFn);
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
        counter++;
        fs.readdir(rootFolder, function (err, files) {
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