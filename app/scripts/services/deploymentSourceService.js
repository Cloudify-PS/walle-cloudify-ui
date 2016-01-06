'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.DeploymentSourceService
 * @description
 * # DeploymentSourceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('DeploymentSourceService', function DeploymentSourceService(BlueprintSourceService, CloudifyService) {
        function _get(id) {
            return CloudifyService.deployments.getDeploymentById(id)
                .then(function (deployment) {
                    return BlueprintSourceService.get(deployment.blueprint_id);
                });
        }

        this.get = _get;
    });
