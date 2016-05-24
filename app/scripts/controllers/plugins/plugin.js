'use strict';

angular.module('cosmoUiApp')
    .controller('PluginCtrl', function($scope, $state, $stateParams, cloudifyClient, HotkeysManager, PluginService) {
        var blueprints;

        $scope.uploadPlugin = uploadPlugin;

        $scope.usageMap = [];
        $scope.itemsByPage = 9;

        PluginService.actions.delete.success = goToPlugins;
        $scope.actions = PluginService.actions;
        $scope.selection = {};

        cloudifyClient.plugins.get($stateParams.pluginId)
            .then(function(response) {
                $scope.plugin = $scope.selection.selected = response.data;
                return cloudifyClient.blueprints.list('id,plan');
            })
            .then(function(data) {
                blueprints = data.data.items;
                return cloudifyClient.deployments.list();
            })
            .then(function(data) {
                $scope.usageMap = aggregateUsageMap(blueprints, data.data.items);
            });

        HotkeysManager.bindPluginActions($scope);

        function uploadPlugin() {
            PluginService.uploadPlugin().then(goToPlugins);
        }

        function goToPlugins() {
            $state.go('cloudifyLayout.plugins');
        }

        function aggregateUsageMap(blueprints, deployments) {
            return blueprints
                .filter(isPluginUsed)
                .map(function(blueprint) {
                    return {
                        blueprint: blueprint.id,
                        deployments: deployments
                            .filter(function(deployment) {
                                return deployment.blueprint_id === blueprint.id;
                            })
                            .map(function(deployment) {
                                return deployment.id;
                            })
                    };
                });
        }

        function isPluginUsed(blueprint) {
            return blueprint.plan &&
                (_.findIndex(blueprint.plan.deployment_plugins_to_install, isCurrentPlugin) > -1 ||
                _.findIndex(blueprint.plan.workflow_plugins_to_install, isCurrentPlugin) > -1);
        }

        function isCurrentPlugin(plugin) {
            return plugin.package_version && plugin.package_name === $scope.plugin.package_name;
        }
    });
