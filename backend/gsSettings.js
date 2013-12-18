var fs = require('fs');

exports.read = function( req, res ) {
    var fileJSON;
    try {
        fileJSON = require('./settings.json');
    } catch (e) {}

    return fileJSON;
};

exports.write = function( req, res ) {
    fs.writeFile("backend/settings.json", JSON.stringify(req, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("settings.json was saved!");
        }
    });
};