'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var fse = require('fs-extra');
var fs = require('fs');
var ZlibService = require('../../../../../backend/services/ZlibService');


describe('ZlibService', function() {

    describe('extract', function() {
        beforeEach(function() {
            conf.browseBlueprint.path = path.join(__dirname, '../../../resources/blueprint/');
        });

        it('should extract a given .archive file into a folder by its name and update timestamp', function() {
            ZlibService.extract('blueprint', '123', function() {
                fs.exists(conf.browseBlueprint.path + 'blueprint/123', function(exists) {
                    expect(exists).to.be(true);
                    fse.remove(conf.browseBlueprint.path + 'blueprint', null);
                });
            });
        });

        it('should return error for trying to extract an invalid .archive file', function() {
            ZlibService.extract('invalidBlueprint', '345', function(err) {
                expect(JSON.stringify(err.e)).to.be('{"errno":-3,"code":"Z_DATA_ERROR"}');
                expect(err.message).to.be('incorrect header check');
                fse.remove(conf.browseBlueprint.path + 'invalidBlueprint', null);
            });
        });
    });
});