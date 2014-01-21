var fs = require('fs');

var whitelabelObj = null;

exports.read = function (req, res) {
    var fileJSON;
    try {
        fileJSON = require('../whitelabel.json');
    } catch (e) {
        console.log('failed to get whitelabel json: ', e);
        return !!whitelabelObj ? whitelabelObj : fileJSON;
    }
    return fileJSON;
};
