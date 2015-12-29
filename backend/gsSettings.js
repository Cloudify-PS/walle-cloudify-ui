'use strict';
var fs = require('fs');
var log4js = require('log4js');
var logger = log4js.getLogger('server');

var settingsObj = null;

exports.read = function () {
    var fileJSON;
    try {
        fileJSON = require('./settings.json');
    } catch (e) {
        return !!settingsObj ? settingsObj : fileJSON;
    }

    return fileJSON;
};

exports.write = function (settingsObj) {

    fs.writeFile('backend/settings.json', JSON.stringify(settingsObj, null, 2), function (err) {
        if (err) {
            logger.info(err);
        } else {
            logger.info('settings.json was saved!');
        }
    });
};
