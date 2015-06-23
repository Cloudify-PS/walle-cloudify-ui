'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.SourceService
 * @description
 * # SourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('SourceService', function SourceService($location, CloudifyService, BlueprintSourceService, DeploymentSourceService, VIEW_CONTEXT) {

        function _get(id, context) {
            var contextService = BlueprintSourceService;
            if (context === VIEW_CONTEXT.DEPLOYMENT) {
                contextService = DeploymentSourceService;
            }
            return contextService.get(id);
        }

        function _getBrowseData(id, last_update) {
            return BlueprintSourceService.getBrowseData(id, last_update);
        }

        this.get = _get;
        this.getBrowseData = _getBrowseData;
    });