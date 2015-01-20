'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var fs = require('fs');
var BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');


describe('BrowseBlueprintService', function() {

    function setBlueprintsPath() {
        conf.browseBlueprint.path = path.join(__dirname, '../../../resources/');
    }

    function removeEmptyFolders() {
        fs.rmdir(conf.browseBlueprint.path + '/invalidBlueprint/111', function() {
            fs.rmdir(conf.browseBlueprint.path + '/invalidBlueprint/');
        });
    }

    describe('browseBlueprint', function() {
        it('should return error if source folder empty', function() {
            setBlueprintsPath();

            fs.mkdir(conf.browseBlueprint.path + 'invalidBlueprint/', function() {
                fs.mkdir(conf.browseBlueprint.path + 'invalidBlueprint/111', function() {
                    BrowseBlueprintService.browseBlueprint('invalidBlueprint', '111', function(err) {
                        removeEmptyFolders();

                        expect(err.message).to.be('Error browsing blueprint files');
                    });
                });
            });

        });
    });
});