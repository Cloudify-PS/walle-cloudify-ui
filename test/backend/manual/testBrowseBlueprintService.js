'use strict';

var conf = require('../../backend/appConf');
var log4js = require('log4js');
log4js.configure(conf.log4js);
var logger = log4js.getLogger('testBrowseBlueprintService');

var browseBlueprintService = require('../services/BrowseBlueprintService');


browseBlueprintService.deleteBlueprint('monBrowse', function(err){
    logger.debug('deleteBlueprint error', err);
});

//browseBlueprintService.fileGetContent('nodecellar', 'cosmo-nodecellar-openstack-master/LICENSE', function(err, content){
//
//    console.log('fileGetContent', err, content);
//
//});


//cloudify4node.browseBlueprint('nodecellar' ,function(err, data) {
//
//
//    console.log('browseBlueprint', err, JSON.stringify(data));
//
//
//});

//browseBlueprintService.isBlueprintExist('nodecellar', function(err, result){
//
//    console.log('is blueprint exist: ' + result);
//
//    browseBlueprintService.browseBlueprint('nodecellar', function(err, listOfFiles){
//        if(!err) {
//            console.log('ListOfFiles: ', JSON.stringify(listOfFiles));
//        }
//        else {
//            console.log('Error: ', err);
//        }
//    });
//
//});


