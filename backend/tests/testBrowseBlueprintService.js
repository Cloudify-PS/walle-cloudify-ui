var browseBlueprintService = require('../services/BrowseBluerprintService');
var cloudify4node = require('../Cloudify4node');


browseBlueprintService.fileGetContent('nodecellar', 'cosmo-nodecellar-openstack-master/LICENSE', function(err, content){

    console.log('fileGetContent', err, content);

});


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


