'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var fs = require('fs.extra');
var BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');
var logger = require('log4js').getLogger('BrowseBlueprintService');


describe('BrowseBlueprintService', function () {

    beforeEach(function () {
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


describe.only('compression', function () {
    var dest = path.join(__dirname, '../../../../../dev/test_resources/tmp');

    beforeEach(function () {
        fs.removeSync(dest);
    });

    afterEach(function () {
        fs.removeSync(dest);
    });


    ['zip', 'tar', 'tar.gz','tar.bz2'].forEach(function (type) {
        it('should decompress ' + type, function (done) {
            var file = path.join(__dirname, '../../../../resources/compression/test_file.' + type);
            BrowseBlueprintService.extractArchive(type, file, dest, function (err) {
                logger.info('callback was called', err);
                expect(!err).to.be(true);

                function testFileExistance() {
                    if (!fs.existsSync(path.join(dest, 'test_file.txt'))) {
                        setTimeout(testFileExistance, 100);
                    } else {
                        done();
                    }
                }

                testFileExistance();

            });
        });
    });

});
