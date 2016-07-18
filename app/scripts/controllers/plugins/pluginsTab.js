'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:PluginsTabCtrl
 * @description
 * # PluginsTabCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('PluginsTabCtrl', function($scope, $stateParams, cloudifyClient) {
        var unwatch;

        $scope.aggregatePluginsList = aggregatePluginsList;

        $scope.plugins = [];
        $scope.itemsByPage = 9;

        unwatch = $stateParams.deploymentId ?
            $scope.$watch('blueprintId', getPlanData) :
            $scope.$watch('blueprint.id', getPlanData);

        function getPlanData(id) {
            if (id) {
                unwatch();
                cloudifyClient.blueprints.get(id, 'plan').then(function(response) {
                    $scope.plugins = aggregatePluginsList(response.data.plan);
                });
            }
        }

        function aggregatePluginsList(plan) {
            return plan.deployment_plugins_to_install
                .concat(plan.workflow_plugins_to_install)
                .filter(function(plugin) { return plugin.package_name; });
        }

    });
