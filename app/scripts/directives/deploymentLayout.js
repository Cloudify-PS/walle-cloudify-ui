'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, nodeStatus, ngDialog, cloudifyClient, ExecutionsService, $routeParams, $log, $filter) {
        var translate = $filter('translate');

        return {
            templateUrl: 'views/deployment/deploymentLayout.html',
            restrict: 'C',
            transclude: true,
            replace: false,
            link: function postLink($scope/*, $element, $attrs*/) {

                var dialog;

                $scope.deploymentId = $routeParams.deploymentId;
                $scope.errorMessage = '';

                // Set Navigation Menu - Need to set only after blueprint id available for source page href
                $scope.navMenu = [
                    {'name': 'Topology', 'href': '/topology', default: true},
                    {'name': 'Network', 'href': '/network'},
                    {'name': 'Nodes', 'href': '/nodes'},
                    {'name': 'Executions', 'href': '/executions'},
                    {'name': 'Inputs & Outputs', 'href': '/inputs-outputs'},
                    {'name': 'Source', 'href': '/source'},
                    {'name': 'Monitoring', 'href': '/monitoring'}
                ];
                _.each($scope.navMenu, function (nm) {
                    if ( $location.path().indexOf(nm.href) >=0 ){
                        nm.active = true;
                    }
                    nm.href = '#/deployment/' + $scope.deploymentId + nm.href;

                });

                // Get Deployment Data
                cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id, workflows')
                    .then(function (result) {
                        $scope.blueprintId = result.data.blueprint_id;
                        $scope.deployment = result.data;
                    }, function( result ){
                        if ( result.status === 404 ){
                            $scope.deploymentNotFound = true;
                            $scope.showDeploymentEvents = false;
                        }
                    });

                function _loadExecutions() {
                    if ( $scope.deploymentNotFound ){
                        return { then: function(){} };
                    }
                    return cloudifyClient.executions.list($scope.deploymentId, 'id,workflow_id,status')
                        .then(function (result) {
                            $scope.currentExecution = _.first(_.filter(result.data, function (execution) {
                                return ExecutionsService.isRunning(execution);
                            }));

                            // mock.... remove!!!
                            //$scope.currentExecution = {"status":"started","workflow_id":"uninstall","id":"fa56b8a1-04b5-43b9-894e-8ae4f44321f3"}

                        },
                        function (result) {
                            if (result.status === 404) {
                                if (!dialog) {
                                    $scope.errorMessage = translate('deployment.executions.error_404');
                                    dialog = ngDialog.openConfirm({

                                        // todo: uncomment this part when 'dialogs as directives' is merged
                                        //template:
                                        //    '<div dialog dialog-title="Oops" dialog-description="{{ errorMessage }}">' +
                                        //        '<div class="dialogButtons"><button class="gs-btn" ng-click="confirm()">Go to deployments list</button></div>' +
                                        //    '</div>',

                                        // todo: remove this part when 'dialogs as directives' is merged
                                        template:
                                            '<div class="dialogBox">' +
                                                '<div class="dialogTitle">Oops</div>' +
                                                '<div class="error-message">{{ errorMessage }}</div>' +
                                                '<div class="buttonsContainer"><button class="gs-btn" ng-click="confirm()">Go to deployments list</button></div>' +
                                            '</div>',

                                        plain: true,
                                        scope: $scope,
                                        className: 'alert-dialog'
                                    }).then(function() {
                                        $scope.goToDeployments();
                                    });
                                }
                            } else {
                                $scope.errorMessage = translate('deployment.executions.error');
                                $log.error('unable to get executions', result.data);
                            }
                        });
                }


                $scope.isInitializing = function () {
                    return $scope.currentExecution && $scope.currentExecution.workflow_id === 'create_deployment_environment';
                };

                $scope.goToDeployments = function() {
                    $location.path('/deployments');
                };

                $scope.registerTickerTask('deploymentLayout/loadExecutions', _loadExecutions, 1000);



                /// for tests

                $scope.loadExecutions = _loadExecutions;

            }
        };
    });
