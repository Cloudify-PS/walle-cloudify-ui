'use strict';

angular.module('cosmoUiApp')
    .controller('PluginsCtrl', function PluginsCtrl($scope, $log, cloudifyClient, PluginService, HotkeysManager, ItemSelection/*, $state*/) {
        $scope.loadPlugins = loadPlugins;
        $scope.select = select;
        $scope.uploadPlugin = uploadPlugin;

        $scope.errorMessage = '';
        $scope.itemsByPage = 9;
        PluginService.actions.delete.success = $scope.loadPlugins;
        $scope.actions = PluginService.actions;

        $scope.loadPlugins();

        $scope.$watch('displayedPlugins', function(newValue) {
            $scope.selection = new ItemSelection(newValue);
        });

        HotkeysManager.bindPluginActions($scope);
        HotkeysManager.bindItemsNavigation($scope, function() {
            $scope.selection.selectNext();
        }, function() {
            $scope.selection.selectPrevious();
        }/*, { // Access to single plugin view is disabled until there is a better API for getting plugin usage
            description: 'Go to selected plugin',
            callback: function() {
                if ($scope.selection.selected) {
                    $state.go('cloudifyLayout.plugin', {pluginId: $scope.selection.selected.id});
                }
            }
        }*/);
        HotkeysManager.bindQuickSearch($scope, function() {
            $scope.focusInput = true;
        });
        HotkeysManager.bindPaging($scope);

        function loadPlugins() {
            cloudifyClient.plugins.list().then(function(response) {
                    $scope.errorMessage = '';
                    $scope.plugins = response.data.items;
                },
                function(response) {
                    $log.error('got error response', response.data);
                    $scope.errorMessage = response && response.status === 403 ? 'permissionError' : 'connectError';
                });
        }

        function select(plugin) {
            $scope.selection.select(plugin);
        }

        function uploadPlugin() {
            PluginService.uploadPlugin().then($scope.loadPlugins);
        }
    });
