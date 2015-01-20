'use strict';
var expect = require('expect.js');
var conf = require('../../../../../backend/appConf');
var path = require('path');
var BrowseBlueprintService = require('../../../../../backend/services/BrowseBlueprintService');


describe('BrowseBlueprintService', function() {

    describe('browseBlueprint', function() {
        conf.browseBlueprint.path = path.join(__dirname, '../../../resources/');

        it('should return error if source folder empty', function() {
            BrowseBlueprintService.browseBlueprint('invalidBlueprint', '111', function(err) {
                expect(err.message).to.be('Error browsing blueprint files');
            });
        });
    });
});