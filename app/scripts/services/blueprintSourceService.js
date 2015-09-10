'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.BlueprintSourceService
 * @description
 * # BlueprintSourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('BlueprintSourceService', function BlueprintSourceService(CloudifyService) {


        this.getBrowseData = function (id, last_update) {
            return CloudifyService.blueprints.browse({id: id, last_update: new Date(last_update).getTime()})
                .then(function (data) {
                    if (data.errCode) {
                        return data;
                    }
                    var browseData = [data];
                    browseData[0].show = true;
                    browseData[0].children[0].show = true;
                    return browseData;
                });
        };


    });
