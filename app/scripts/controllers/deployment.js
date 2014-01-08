'use strict';

angular.module('cosmoUi')
    .controller('DeploymentCtrl', function ($scope, $cookieStore, $routeParams, RestService) {
        $scope.events = [];
        $scope.filters = {
            'connections': 'on',
            'modules': 'on',
            'middleware': 'off',
            'compute': 'on',
            'network': 'on'
        };

        $scope.deployment = JSON.parse($routeParams.deployment);

        var id = $scope.deployment.id;
        var from = 0;
        var to = 5;

        function _loadEvents() {
            if (id === undefined) {
                return;
            }
            RestService.loadEvents({ deploymentId : id, from: from, to: to })
                .then(null, null, function(data) {
                    if (data.id !== undefined && data.lastEvent !== undefined) {

                        if (data.events && data.events.length > 0) {
                            $scope.events = $scope.events.concat(data.events);

                            for (var i = 0; i < $scope.events.length; i++) {
                                if (typeof($scope.events[0]) === 'string') {    // walkaround if the events returned as strings and not JSONs
                                    $scope.events[i] = JSON.parse($scope.events[i]);
                                }
                            }
                        }
                    }
                });
        }

        _loadEvents();
    });
