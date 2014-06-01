var browseBlueprintService = require('../services/BrowseBluerprintService');

browseBlueprintService.isBlueprintExist('nodecellar', function(err, result){

    console.log('is blueprint exist: ' + result);

    browseBlueprintService.browseBlueprint('nodecellar', function(err, listOfFiles){
        if(!err) {
            console.log('ListOfFiles: ', JSON.stringify(listOfFiles));
        }
        else {
            console.log('Error: ', err);
        }
    });

});


