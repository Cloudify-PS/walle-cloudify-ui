'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var fs = require('fs.extra');
var BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');


describe('BrowseBlueprintService', function () {

    beforeEach(function () {
        conf.browseBlueprint.path = path.join(__dirname, '../../../resources/');
    });

    afterEach(function () {
        console.log('deleting  ', conf.browseBlueprint.path);
        fs.removeSync( path.join( conf.browseBlueprint.path, 'invalidBlueprint') );
        fs.removeSync( path.join( conf.browseBlueprint.path, '111.archive') );
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
