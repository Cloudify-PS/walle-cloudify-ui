'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore) {

        $scope.blueprints = $cookieStore.get('blueprints');
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


        function _loadDeployments(){
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

        _loadDeployments();

    });
