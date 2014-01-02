'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore) {

        $scope.blueprints = $cookieStore.get('blueprints');
        $scope.events = [];
        $scope.selectedBlueprint = '';
//        $scope.filters = {
//            'connections': 'on',
//            'modules': 'on',
//            'middleware': 'off',
//            'compute': 'on',
//            'network': 'on'
//        };

        $scope.showDeployments = function(blueprintName) {
            if (blueprintName === $scope.selectedBlueprint) {
                $scope.selectedBlueprint = '';
            } else {
                $scope.selectedBlueprint = blueprintName;
            }
        };

        $scope.executeDeployment = function(deployment) {
            RestService.executeBlueprint(deployment.id);
            $cookieStore.put('deploymentId', deployment.id);
        };

        $scope.isExecuting = function(deploymentId) {
            return deploymentId === $cookieStore.get('deploymentId');
        };

        function _loadDeployments() {
            RestService.loadDeployments()
                .then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)].deployments.push(data[i]);
                    }
                });
        }

        function _getBlueprintIndex(blueprintId) {
            var blueprintIndex = -1;
            for (var j = 0; j < $scope.blueprints.length; j++) {
                if ($scope.blueprints[j].id === blueprintId) {
                    blueprintIndex = j;
                }
            }

            return blueprintIndex;
        }

        var id = $cookieStore.get('deploymentId');
        var from = 0;
        var to = 5;

        function _loadEvents() {
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

        _loadDeployments();
        _loadEvents();

    });
