'use strict';

var conf = require('../../../../backend/appConf');
var logger = require('log4js').getLogger('deleteBlueprintFiles.spec');
var browseBlueprint = require('../../../../backend/services/BrowseBlueprintService');
var fs = require('fs');
var path = require('path');

var blueprint = 'blueprint';
var prefix = 'unitTest-';
var fileExt = '.tar.gz';

var writeFileComplete = false;
var mkdirComplete = false;
var blueprintRemove = false;

describe('Backend: Delete Blueprints Files (CFY-1496)', function(){
    logger.info('running test');
    describe('Create files and folder', function(){
        beforeEach(function(){
            fs.mkdir(conf.browseBlueprint.path, function (e) {
                if (!e || (e && e.code === 'EEXIST')) {
                    fs.writeFile(path.resolve(conf.browseBlueprint.path, prefix + blueprint + fileExt), '', function (err) {
                        if (err) {
                            throw err;
                        } else {
                            writeFileComplete = true;
                        }
                    });

                    fs.mkdir(path.resolve(conf.browseBlueprint.path, prefix + blueprint), function (e) {
                        if (!e || (e && e.code === 'EEXIST')) {
                            mkdirComplete = true;
                        } else {
                            throw e;
                        }
                    });
                }
            });
        });

        it('should have blueprint file', function(){
            waitsFor(function() {
                return writeFileComplete;
            }, 'The Blueprint file created', 1000);

            runs(function() {
                var fileExists = fs.existsSync(path.resolve(conf.browseBlueprint.path, prefix + blueprint + fileExt));
                expect(fileExists).toBe(true);
            });
        });

        it('should have blueprint folder', function(){
            waitsFor(function() {
                return mkdirComplete;
            }, 'The Blueprint folder created', 1000);

            runs(function() {
                var folderExists = fs.existsSync(path.resolve(conf.browseBlueprint.path, prefix + blueprint));
                expect(folderExists).toBe(true);
            });
        });

        afterEach(function() {
            browseBlueprint.deleteBlueprint(prefix + blueprint, function(err){
                if (err) {
                    throw err;
                }
                else {
                    blueprintRemove = true;
                }
            });
        });
    });

    describe('Delete files and folder', function(){
        it('should delete blueprint file', function(){
            waitsFor(function() {
                return blueprintRemove;
            }, 'The Blueprint tar.gz and folder should be removed', 1000);

            runs(function() {
                var fileExists = fs.existsSync(path.resolve(conf.browseBlueprint.path, prefix + blueprint + fileExt));
                expect(fileExists).toBe(false);
            });
        });

        it('should delete blueprint folder', function(){
            waitsFor(function() {
                return blueprintRemove;
            }, 'The Blueprint tar.gz and folder should be removed', 1000);

            runs(function() {
                var folderExists = fs.existsSync(path.resolve(conf.browseBlueprint.path, prefix + blueprint));
                expect(folderExists).toBe(false);
            });
        });
    });

});