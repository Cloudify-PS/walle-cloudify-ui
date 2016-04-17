'use strict';

angular.module('cosmoUiApp')
    .directive('appStatusWidget', function (cloudifyClient, NodeService) {
        return {
            templateUrl: 'views/directives/appStatusWidget.html',
            transclude: true,
            scope: {
                'deploymentId': '='
            },
            restrict: 'A',
            link: function ($scope) {
                function loadInstances() {
                    if (!$scope.deploymentId) {
                        $scope.succeed = undefined;
                        return;
                    }
                    return cloudifyClient.executions.getRunningExecutions({deployment_id: $scope.deploymentId, _include: 'id,workflow_id,status'}).then(function(httpResponse){
                        if(httpResponse.data.items.length !== 0){
                            $scope.succeed = undefined;
                            return;
                        }
                        cloudifyClient.nodeInstances.list($scope.deploymentId, 'state').then(function (result) {

                            var progress = Math.floor(NodeService.status.calculateProgress(result.data.items));
                            $scope.succeed = progress === 100 ? true : progress === 0 ? undefined : false;

                            $scope.value = {'done': progress};
                            $scope.text = progress;
                        });
                    });
                }

                loadInstances();
                // need to use $parent here
                // https://github.com/js-black-belt/angular-ticker/pull/15
                $scope.$parent.registerTickerTask('appStatus/loadInstances', loadInstances, 10000);

            }
        };
    });
