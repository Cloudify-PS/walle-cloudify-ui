'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var fs = require('fs-extra');
var logger = require('log4js').getLogger('CompressService');
var CompressService = require('../../../../../backend/services/CompressService');


describe('CompressService', function () {

    describe('extract', function () {
        beforeEach(function (done) {
            var tmpPath = path.join(require('os').tmpdir(), 'test','workspace','comrpess');
            var blueprintPath =  path.join(__dirname, '..','..','..','resources','blueprint');
            fs.ensureFileSync( blueprintPath );
            fs.mkdirsSync(tmpPath);
            conf.browseBlueprint.path = tmpPath;
            fs.copy( blueprintPath, tmpPath, done );
        });

        afterEach(function ( done ) {
            logger.info('deleting', conf.browseBlueprint.path);
            fs.remove(conf.browseBlueprint.path, done);
        });

        it('should extract a given .archive file into a folder by its name and update timestamp', function (done) {
            CompressService.extract('blueprint', '123', function () {
                fs.exists(path.join(conf.browseBlueprint.path , 'blueprint','123'), function (exists) {
                    expect(exists).to.be(true);
                    done();
                });
            });
        });

        it('should return error for trying to extract an invalid .archive file', function (done) {
            CompressService.extract('invalidBlueprint', '345', function (err) {
                expect(JSON.stringify(err.e)).to.be('{"errno":-3,"code":"Z_DATA_ERROR"}');
                expect(err.message).to.be('incorrect header check');
                done();
            });
        });
    });
});
