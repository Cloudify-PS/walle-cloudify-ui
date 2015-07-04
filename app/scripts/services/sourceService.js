'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.SourceService
 * @description
 * # SourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('SourceService', function SourceService($location, CloudifyService, BlueprintSourceService ) {

        function _getBrowseData(id, last_update) {
            return BlueprintSourceService.getBrowseData(id, last_update);
        }

        this.getBrowseData = _getBrowseData;
    });
