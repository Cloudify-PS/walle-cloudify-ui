'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:bpActionSelector
 * @description
 * # bpActionSelector
 */
angular.module('cosmoUiApp')
    .directive('bpActionSelector', function (ngDialog, cloudifyClient, $routeParams, $location) {
        return {
            templateUrl: 'views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                blueprint: '=',

                onDelete: '&'
            },
            controller: function ($scope) {

                function openDeployDialog(blueprintId) {
                    $scope.selectedBlueprint = null;
                    $scope.blueprintId = blueprintId;
                    ngDialog.open({
                        template: 'views/blueprint/deployBlueprintDialog.html',
                        controller: 'DeployDialogCtrl',
                        scope: $scope,
                        className: 'deploy-dialog'
                    });

                }

                function openDeleteDialog() {

                    ngDialog.open({
                        template: 'views/blueprint/deleteBlueprintDialog.html',
                        controller: 'DeleteBlueprintDialogCtrl',
                        scope: $scope,
                        className: 'delete-dialog'
                    });
                }

                $scope.onCreate = function(deployment){
                    $location.path('/deployment/' + deployment.id + '/topology');
                    $location.search('');
                };

                $scope.selectAction = function (action) {
                    $scope.currentTask = action.name;
                    $scope.defaultAction = action;
                    action.task();
                };

                $scope.actions = [
                    {
                        name: 'blueprints.actions.deployBtn',
                        task: function () {
                            openDeployDialog($scope.blueprint.id);
                        }
                    },
                    {
                        name: 'blueprints.actions.deleteBtn',
                        task: openDeleteDialog
                    }
                ];

                $scope.defaultAction = $scope.actions[0];

                if ($routeParams.deploy === 'true') {
                    openDeployDialog($scope.blueprint.id);
                }
            },
            link: function postLink(scope, element) {

                scope.$watch('currentExecution', function (executing) {
                    if (executing) {
                        element.addClass('in-progress');
                    } else {
                        element.removeClass('in-progress');
                    }
                }, true);

            }
        };
    });
