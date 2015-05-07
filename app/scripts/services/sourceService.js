'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.SourceService
 * @description
 * # SourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('SourceService', function SourceService($location, CloudifyService, BlueprintSourceService, DeploymentSourceService) {

        function _get(id, context) {
            var contextService = BlueprintSourceService;
            if (context === 'deployment') {
                contextService = DeploymentSourceService;
            }
            return contextService.get(id);
        }

        this.get = _get;
    });