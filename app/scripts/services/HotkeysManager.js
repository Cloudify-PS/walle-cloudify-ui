'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.HotkeysManager
 * @description
 * # HotkeysManager
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
  .service('HotkeysManager', function (hotkeys, $state) {
      this.bindNavigations = function(scope){
          hotkeys.bindTo(scope)
              .add({
                combo: 'mod+b',
                description: 'Navigating to Blueprint',
                callback: function() {
                    $state.go('cloudifyLayout.blueprints');
                }
            })
            .add({
                combo: 'mod+d',
                description: 'Navigating to Deployments',
                callback: function(e) {
                    e.preventDefault();
                    $state.go('cloudifyLayout.deployments');
                }
            })
            .add({
                combo: 'mod+l',
                description: 'Navigating to Logs & events',
                callback: function(e) {
                    e.preventDefault();
                    $state.go('cloudifyLayout.logs');
                }
            })
            .add({
                combo: 'mod+i',
                description: 'Navigating to Nodes-Instances',
                callback: function() {
                    $state.go('cloudifyLayout.nodes');
                }
            });
      };

      this.bindUploadBlueprint = function(scope){
          hotkeys.bindTo(scope)
              .add({
                  combo: 'u',
                  description: 'Upload blueprint',
                  callback: function() {
                      scope.openAddDialog();
                  }
              });
      };

      this.bindBlueprintActions = function(scope){
          hotkeys.bindTo(scope)
              .add({
                  combo: 'd',
                  description: 'Deploy blueprint',
                  callback: function() {
                      scope.$broadcast('hotkeyDeploy');
                  }
              })
              .add({
                  combo: 'shift+d',
                  description: 'Delete blueprint',
                  callback: function() {
                      scope.$broadcast('hotkeyDeleteBlueprint');
                  }
              });
      };

      this.bindDeploymentActions = function(scope){
          hotkeys.bindTo(scope)
              .add({
                  combo: 'e',
                  description: 'Execute deployment',
                  callback: function() {
                      scope.$broadcast('hotkeyExecute');
                  }
              })
              .add({
                  combo: 'shift+e',
                  description: 'Cancel Executing deployment',
                  callback: function() {
                      scope.$broadcast('hotkeyCancelExecution');
                  }
              })
              .add({
                  combo: 'shift+d',
                  description: 'Delete blueprint',
                  callback: function() {
                      scope.$broadcast('hotkeyDeleteDeployment');
                  }
              });
      };
  });
