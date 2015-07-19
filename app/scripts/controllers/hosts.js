'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, $filter, NodeSearchService, $timeout ) {


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
            blueprints.forEach(function(blueprint) {
                deployments.forEach(function (deployment) {
                    if (blueprint.value === deployment.parent) {
                        blueprintsWithDeployments.push(blueprint);
                    }
                });
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
            $scope.deployBlueprintButton = false;
            var startTime = new Date().getTime();
            $scope.filterLoading = true;
            $scope.nodesList = null;
            NodeSearchService.execute(_type, _blueprint, _deployments)
                .then(function(data){




                    $timeout(function() {  // fake delay time if response was too fast
                        $scope.nodesList = data;
                        _currentBlueprint = _blueprint;
                        if ( !$scope.nodesList || $scope.nodesList.length === 0 ){
                            $scope.emptyReason = $filter('translate')('hosts.blueprintEmpty', { blueprint_id : _blueprint } );
                            $scope.deployBlueprintButton = true;

                        }
                        $scope.filterLoading = false;
                    },2000 + new Date().getTime() - startTime  );


                });
        }

        $scope.getBlueprintId = function() {
            return _currentBlueprint;
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            if(newValue !== null) {
                $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, [newValue]);
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
