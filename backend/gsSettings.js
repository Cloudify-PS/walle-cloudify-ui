var fs = require('fs');

var settingsObj = null;

exports.read = function( req, res ) {
    var fileJSON;
    try {
        fileJSON = require('./settings.json');
    } catch (e) { return !!settingsObj ? settingsObj : fileJSON;}

    return fileJSON;
};

exports.write = function( settingsObj ) {

    fs.writeFile("backend/settings.json", JSON.stringify(settingsObj, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("settings.json was saved!");
        }
    });
};