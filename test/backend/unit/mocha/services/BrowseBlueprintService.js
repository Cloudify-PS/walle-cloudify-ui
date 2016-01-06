'use strict';
var expect = require('expect.js');
var conf = null;
var path = require('path');
var fs = require('fs.extra');

var logger = require('log4js').getLogger('BrowseBlueprintService');

describe('BrowseBlueprintService', function () {
    var BrowseBlueprintService = null;
    beforeEach(function () {
        conf = require('../../../../../backend/appConf');
        BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');
        conf.browseBlueprint.path = path.join(__dirname, '../../../resources/');
    });

    afterEach(function () {
        console.log('deleting  ', conf.browseBlueprint.path);
        fs.removeSync(path.join(conf.browseBlueprint.path, 'invalidBlueprint'));
        fs.removeSync(path.join(conf.browseBlueprint.path, '111.archive'));
    });

    describe('browseBlueprint', function () {
        it('should return error if source folder empty', function (done) {
            fs.mkdirs(path.join(conf.browseBlueprint.path, 'invalidBlueprint', '111'), function () {
                BrowseBlueprintService.walkBlueprint('invalidBlueprint', '111', function (err) {
                    expect(err.message).to.be('Error browsing blueprint files');
                    done();
                });
            });
        });
    });
});

describe('compression', function () {
    var dest = path.join(__dirname, '../../../../../dev/test_resources/tmp');
    var BrowseBlueprintService = null;
    beforeEach(function () {
        fs.removeSync(dest);
        conf = require('../../../../../backend/appConf');
        BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');
    });

    afterEach(function () {
        fs.removeSync(dest);
    });

    ['zip', 'tar', 'tar.gz', 'tar.bz2'].forEach(function (type) {
        it('should decompress ' + type, function (done) {
            var file = path.join(__dirname, '../../../../resources/compression/test_file.' + type);
            BrowseBlueprintService.extractArchive(type, file, dest, function (err) {
                logger.info('callback was called', err);
                expect(!err).to.be(true);

                function testFileExistance() {
                    if ((type !== 'zip' && fs.existsSync(path.join(dest, 'test_file.txt')) ||
                            (type === 'zip' && fs.existsSync(path.join(dest, 'cloudify-nodecellar-example-master/LICENSE'))) // CFY-3772 add test for zip, resource should have a folder
                        )) {
                        done();
                    } else {
                        setTimeout(testFileExistance, 100);
                    }
                }

                testFileExistance();

            });
        });
    });

});
