'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.BlueprintSourceService
 * @description
 * # BlueprintSourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('BlueprintSourceService', function BlueprintSourceService($location, CloudifyService) {
        function _get(id) {
            return CloudifyService.blueprints.getBlueprintById({id: id})
                .then(function(blueprintData) {
                    return blueprintData;
                });
        }

        function _getBrowseData(id, last_update) {
            return CloudifyService.blueprints.browse({id: id, last_update: new Date(last_update).getTime()})
                .then(function(data) {
                    if (data.errCode) {
                        return data;
                    }
                    var browseData = [data];
                    browseData[0].show = true;
                    browseData[0].children[0].show = true;
                    return browseData;
                });
        }

        this.get = _get;
        this.getBrowseData = _getBrowseData;
    });