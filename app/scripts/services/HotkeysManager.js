'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.HotkeysManager
 * @description
 * # HotkeysManager
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
  .service('HotkeysManager', function (hotkeys, $state, $timeout) {
        this.bindNavigations = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'mod+b',
                    description: 'Navigate to Blueprints',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function () {
                        $state.go('cloudifyLayout.blueprints');
                    }
                })
                .add({
                    combo: 'mod+d',
                    description: 'Navigate to Deployments',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        $state.go('cloudifyLayout.deployments');
                    }
                })
                .add({
                    combo: 'mod+p',
                    description: 'Navigate to Plugins',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function(e) {
                        e.preventDefault();
                        $state.go('cloudifyLayout.plugins');
                    }
                })
                .add({
                    combo: 'mod+l',
                    description: 'Navigate to Logs & Events',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        $state.go('cloudifyLayout.logs');
                    }
                })
                .add({
                    combo: 'mod+i',
                    description: 'Navigate to Node-Instances',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function () {
                        $state.go('cloudifyLayout.nodes');
                    }
                });
        };

        this.bindUploadBlueprint = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'u',
                    description: 'Upload a blueprint',
                    callback: function () {
                        scope.openAddDialog();
                    }
                });
        };

        // Binding directive logic on the conroller scope instead the directive itself since it overrides binds
        // https://github.com/chieffancypants/angular-hotkeys/issues/195
        this.bindBlueprintActions = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'd',
                    description: 'Create a deployment',
                    callback: function () {
                        scope.$broadcast('hotkeyDeploy');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete current blueprint',
                    callback: function () {
                        scope.$broadcast('hotkeyDeleteBlueprint');
                    }
                });
        };

        this.bindDeploymentActions = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'e',
                    description: 'Execute a workflow',
                    callback: function () {
                        scope.$broadcast('hotkeyExecute');
                    }
                })
                .add({
                    combo: 'shift+e',
                    description: 'Cancel workflow execution',
                    callback: function () {
                        scope.$broadcast('hotkeyCancelExecution');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete current deployment',
                    callback: function () {
                        scope.$broadcast('hotkeyDeleteDeployment');
                    }
                })
                .add({
                    combo: 'u',
                    description: 'Update deployment',
                    callback: function () {
                        scope.$broadcast('hotkeyUpdateDeployment');
                    }
                });
        };

        this.bindPluginActions = function(scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'u',
                    description: 'Upload plugin',
                    callback: scope.uploadPlugin
                })
                .add({
                    combo: 'd',
                    description: 'Download plugin',
                    callback: function() {
                        scope.$broadcast('hotkeyDownloadPlugin');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete plugin',
                    callback: function() {
                        scope.$broadcast('hotkeyDeletePlugin');
                    }
                });
        };

        this.bindSnapshotActions = function(scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'c',
                    description: 'Create snapshot',
                    callback: scope.createSnapshot
                })
                .add({
                    combo: 'u',
                    description: 'Upload snapshot',
                    callback: scope.uploadSnapshot
                })
                .add({
                    combo: 'r',
                    description: 'Restore snapshot',
                    callback: function() {
                        scope.$broadcast('hotkeyRestoreSnapshot');
                    }
                })
                .add({
                    combo: 'd',
                    description: 'Download snapshot',
                    callback: function() {
                        scope.$broadcast('hotkeyDownloadSnapshot');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete snapshot',
                    callback: function() {
                        scope.$broadcast('hotkeyDeleteSnapshot');
                    }
                });
        };

        this.bindItemsNavigation = function (scope, nextCallback, previousCallback, enterItemOpts) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'j',
                    description: 'Next item',
                    callback: nextCallback
                })
                .add({
                    combo: 'k',
                    description: 'Previous item',
                    callback: previousCallback
                });
            if (enterItemOpts) {
                hotkeys.bindTo(scope)
                    .add({
                        combo: 'enter',
                        description: enterItemOpts.description,
                        callback: enterItemOpts.callback
                    });
            }

        };

        this.bindBlueprintNavigation = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'g t',
                    description: 'Go to Topology',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.topology');
                    }
                })
                .add({
                    combo: 'g n',
                    description: 'Go to Nodes',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.nodes');
                    }
                })
                .add({
                    combo: 'g p',
                    description: 'Go to Plugins',
                    callback: function() {
                        $state.go('cloudifyLayout.blueprintLayout.plugins');
                    }
                })
                .add({
                    combo: 'g s',
                    description: 'Go to Source',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.source');
                    }
                });
        };

        this.bindDeploymentNavigation = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'g t',
                    description: 'Go to Topology',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.topology');
                    }
                })
                .add({
                    combo: 'g n',
                    description: 'Go to Nodes',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.nodes');
                    }
                })
                .add({
                    combo: 'g e',
                    description: 'Go to Executions',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.executions');
                    }
                })
                .add({
                    combo: 'g i',
                    description: 'Go to Inputs & Outputs',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.inputsOutputs');
                    }
                })
                .add({
                    combo: 'g p',
                    description: 'Go to Plugins',
                    callback: function() {
                        $state.go('cloudifyLayout.deploymentLayout.plugins');
                    }
                })
                .add({
                    combo: 'g s',
                    description: 'Go to Source',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.source');
                    }
                })
                .add({
                    combo: 'g m',
                    description: 'Go to Monitoring',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.monitoring');
                    }
                });
        };

        this.bindQuickSearch = function (scope, callback) {
            hotkeys.bindTo(scope)
                .add({
                    combo: '/',
                    description: 'Quick Search',
                    callback: callback
                });
        };

        this.bindPaging = function (scope) {
            function getCurrentPage() {
                return $('.pagination li.active');
            }

            hotkeys.bindTo(scope)
                .add({
                    combo: 'n',
                    description: 'Next page',
                    callback: function () {
                        $timeout(function () {
                            var currentPage = getCurrentPage();
                            if (currentPage) {
                                var nextPage = currentPage.next().children()[0];
                                if (nextPage) {
                                    nextPage.click();
                                }
                            }
                        });
                    }
                })
                .add({
                    combo: 'p',
                    description: 'Previous page',
                    callback: function () {
                        $timeout(function () {
                            var currentPage = getCurrentPage();
                            if (currentPage) {
                                var prevPage = currentPage.prev().children()[0];
                                if (prevPage) {
                                    prevPage.click();
                                }
                            }
                        });
                    }
                });
        };

        hotkeys.add({
            combo: 'esc',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function(event){
                var active = document.activeElement;
                //ie9 bug https://www.tjvantoll.com/2013/08/30/bugs-with-document-activeelement-in-internet-explorer/
                if(active && active !== document.body){
                    event.preventDefault();
                    active.blur();
                }
            }
        });
    });
