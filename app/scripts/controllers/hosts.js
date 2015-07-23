'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, $filter, NodeSearchService ) {


        /**
         * Hosts
         */
        var _type = 'cloudify.nodes.Compute';
        var _deployments = {};
        var _blueprint = null;
        var _currentBlueprint = null;
        var _deploymentsList = [];
        $scope.emptyReason = $filter('translate')('hosts.chooseBlueprint');

        function getBlueprintsWithDeployments(blueprints, deployments){
            var blueprintsWithDeployments = [];
            blueprints.forEach(function(blueprint){
                for(var i=0;i<deployments.length;i++){
                    if (blueprint.value === deployments[i].parent) {
                        blueprintsWithDeployments.push(blueprint);
                        break;
                    }
                };
            });
            return blueprintsWithDeployments;
        }

        NodeSearchService.getNodeSearchData()
            .then(function(data){
                $scope.blueprintsList = getBlueprintsWithDeployments(data.blueprints,data.deployments);
                _deploymentsList = data.deployments;
            });

        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'blueprints': null,
            'deployments': null
        };

        function _execute() {
            $scope.emptyReason = null;
            $scope.filterLoading = true;
            $scope.nodesList = null;
            NodeSearchService.execute(_type, _blueprint, _deployments)
                .then(function(data){
                    $scope.nodesList = data;
                    _currentBlueprint = _blueprint;
                    $scope.filterLoading = false;
                });
        }

        $scope.getBlueprintId = function() {
            return _currentBlueprint;
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            if(newValue !== null) {
                $scope.deploymentsList = $filter('listByList')(_deploymentsList, [newValue]);
                _blueprint = newValue.value;
            }
            else {
                $scope.deploymentsList = [];
                _blueprint = null;
            }
        }, true);

        $scope.$watch('eventsFilter.deployments', function(newValue){
            _deployments = newValue;
        }, true);

        $scope.execute = function() {
            if (!$scope.isSearchDisabled()) {
                _execute();
            }
        };

        $scope.isSearchDisabled = function() {
            return $scope.eventsFilter.blueprints === null || $scope.eventsFilter.blueprints.length === 0;
        };

    });
