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
        var unwatch_1;

        $scope.aggregatePluginsList = aggregatePluginsList;

        $scope.plugins = [];
        $scope.itemsByPage = 9;

        // wait for blueprint with plan to appear either on this scope or on $parent scope
        unwatch = $scope.$watch('blueprint.plan', function(plan) {
            if (plan) {
                unwatch();

                aggregatePluginsList(plan);
            }
        });

        // if on Deployment page
        if ($stateParams.deploymentId) {
            // wait for blueprintId to appear on $parent.$parent scope
            unwatch_1 = $scope.$watch('blueprintId', function(id) {
                if (id) {
                    unwatch_1();

                    cloudifyClient.blueprints.get(id, 'plan').then(function(response) {
                        $scope.blueprint = response.data;
                    });
                }
            });
        }

        function aggregatePluginsList(plan) {
            $scope.plugins = plan.deployment_plugins_to_install
                .concat(plan.workflow_plugins_to_install)
                .filter(function(plugin) { return plugin.package_name; });
        }

    });
