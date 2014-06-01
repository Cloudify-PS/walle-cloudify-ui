var conf = require("../appConf");
var fs = require('fs.extra');
var path = require('path');

module.exports.isBlueprintExist = function (id, callbackFn) {
    fs.exists(path.join(conf.browseBlueprint.path, id), function (exists){
        callbackFn(null, exists);
    });
};

module.exports.browseBlueprint = function (id, callbackFn){
    if(id.indexOf('.') !== -1 || id.indexOf('/') !== -1) {
        var err = new Error('Blueprint ID can\'t contain spacial characters.');
        return callbackFn(err);
    }
    var walker = new Walker();
    walker.walk(path.join(conf.browseBlueprint.path, id), callbackFn);
};

function Walker() {
    var _finalCallback = null;
    var root = { 'name': 'root', 'children': []};
    var origRoot;
    var counter = 0;

    function addChild(rootFolder, children, file) {
        fs.stat(path.join(rootFolder, file), function (err, result) {
            if (result.isDirectory()) {
                var newItem = {
                    'name': file,
                    'children': []
                };
                children.push(newItem);
                walkFolder(path.join(rootFolder, file), newItem.children);
            } else {
                children.push({
                    'name': file,
                    'relativePath': path.relative(origRoot, path.join(rootFolder, file))
                });
            }
            counter--;
            if (counter == 0) {
                _finalCallback(null, root);
            }
        })
    }

    function walkFolder(rootFolder, _list) {
        counter++;
        fs.readdir(rootFolder, function (err, files) {
            counter += files.length;
            counter--;
            for (var i in files) {
                if(files.hasOwnProperty(i)) {
                    addChild(rootFolder, _list, files[i]);
                }
            }
        });
    }

    this.walk = function (rootFolder, callback) {
        _finalCallback = callback;
        origRoot = path.resolve(rootFolder);
        walkFolder(rootFolder, root.children);
    }

}