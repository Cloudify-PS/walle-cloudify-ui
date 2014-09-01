'use strict';

describe('Backend: tempFolder', function () {
    var os = require('os');
    var conf = require('../../../../backend/appConf.js');

    it('should return system folder for temporary content', function() {
        var systemTempFolder = os.tmpdir();
        var backendTempFolder = conf.browseBlueprint.path;

        expect(backendTempFolder.indexOf(systemTempFolder)).toBe(0);
    });
});