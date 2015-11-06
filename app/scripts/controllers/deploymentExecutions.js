'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams, cloudifyClient, ngDialog, $log, $location) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];
        $scope.errorMessage = '';

        cloudifyClient.executions.list($scope.deploymentId)
            .then(function (httpResponse) {
                $scope.executionsList = httpResponse.data;
            },
            function (error) {
                if (error.status === 404) {
                    $scope.errorMessage = 'deployment.executions.error_404.description';
                    ngDialog.openConfirm({

                        // todo: uncomment this part when 'dialog directive' is merged
                        //template:
                        //    '<div dialog dialog-title="{{ "deployment.executions.error_404.title" | translate }}" dialog-description="{{ errorMessage | translate }}">' +
                        //        '<div class="dialogButtons"><button class="gs-btn" ng-click="confirm()">{{ "deployment.executions.error_404.button" | translate }}</button></div>' +
                        //    '</div>',

                        // todo: remove this part when 'dialog directive' is merged
                        template:
                            '<div class="dialogBox">' +
                                '<div class="dialogTitle">{{ "deployment.executions.error_404.title" | translate }}</div>' +
                                '<div class="dialogDescription">{{ errorMessage | translate }}</div>' +
                                '<div class="buttonsContainer"><button class="gs-btn" ng-click="confirm()">{{ "deployment.executions.error_404.button" | translate }}</button></div>' +
                            '</div>',

                        plain: true,
                        scope: $scope,
                        className: 'alert-dialog'
                    }).then(function () {
                        $location.path('/deployments');
                    });
                } else {
                    $scope.errorMessage = 'deployment.executions.error';
                    $log.error(error);
                }
            });
    });
