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
                    description: 'Navigating to Blueprint',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function () {
                        $state.go('cloudifyLayout.blueprints');
                    }
                })
                .add({
                    combo: 'mod+d',
                    description: 'Navigating to Deployments',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        $state.go('cloudifyLayout.deployments');
                    }
                })
                .add({
                    combo: 'mod+l',
                    description: 'Navigating to Logs & events',
                    allowIn: ['INPUT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        $state.go('cloudifyLayout.logs');
                    }
                })
                .add({
                    combo: 'mod+i',
                    description: 'Navigating to Nodes-Instances',
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
                    description: 'Upload blueprint',
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
                    description: 'Deploy blueprint',
                    callback: function () {
                        scope.$broadcast('hotkeyDeploy');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete blueprint',
                    callback: function () {
                        scope.$broadcast('hotkeyDeleteBlueprint');
                    }
                });
        };

        this.bindDeploymentActions = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'e',
                    description: 'Execute deployment',
                    callback: function () {
                        scope.$broadcast('hotkeyExecute');
                    }
                })
                .add({
                    combo: 'shift+e',
                    description: 'Cancel Executing deployment',
                    callback: function () {
                        scope.$broadcast('hotkeyCancelExecution');
                    }
                })
                .add({
                    combo: 'shift+d',
                    description: 'Delete blueprint',
                    callback: function () {
                        scope.$broadcast('hotkeyDeleteDeployment');
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
                    description: 'Go to topology',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.topology');
                    }
                })
                .add({
                    combo: 'g n',
                    description: 'Go to nodes',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.nodes');
                    }
                })
                .add({
                    combo: 'g s',
                    description: 'Go to source',
                    callback: function () {
                        $state.go('cloudifyLayout.blueprintLayout.source');
                    }
                });
        };

        this.bindDeploymentNavigation = function (scope) {
            hotkeys.bindTo(scope)
                .add({
                    combo: 'g t',
                    description: 'Go to topology',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.topology');
                    }
                })
                .add({
                    combo: 'g n',
                    description: 'Go to nodes',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.nodes');
                    }
                })
                .add({
                    combo: 'g e',
                    description: 'Go to executions',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.executions');
                    }
                })
                .add({
                    combo: 'g i',
                    description: 'Go to inputs & outputs',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.inputsOutputs');
                    }
                })
                .add({
                    combo: 'g s',
                    description: 'Go to source',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.source');
                    }
                })
                .add({
                    combo: 'g m',
                    description: 'Go to monitoring',
                    callback: function () {
                        $state.go('cloudifyLayout.deploymentLayout.monitoring');
                    }
                });
        };

        this.bindQuickSearch = function (scope, callback) {
            hotkeys.bindTo(scope)
                .add({
                    combo: '/',
                    description: 'Quick search',
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
