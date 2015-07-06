'use strict';

angular.module('cosmoUiApp')
    .directive('appStatusWidget', function ( cloudifyClient, NodeService  ) {
        return {
            templateUrl: 'views/directives/appStatusWidget.html',
            transclude: true,
            scope:{
                'deploymentId' : '='
            },
            restrict: 'A',
            link: function ($scope) {
                function loadInstances() {
                    if ( !$scope.deploymentId ){
                        return;
                    }
                    return cloudifyClient.nodeInstances.list($scope.deploymentId, 'state' ).then(function (result) {

                        var progress = Math.floor(NodeService.status.calculateProgress( result.data ));
                        $scope.value = { 'done' : progress };
                        $scope.text = progress;
                    });
                }

                // need to use $parent here
                // https://github.com/js-black-belt/angular-ticker/pull/15
                $scope.$parent.registerTickerTask('appStatus/loadInstances', loadInstances, 10000);

            }
        };
    });
