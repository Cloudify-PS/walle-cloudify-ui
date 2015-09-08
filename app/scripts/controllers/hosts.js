'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, $filter, cloudifyClient ) {


        /**
         * Hosts
         */
        var _type = 'cloudify.nodes.Compute';
        var _blueprint = null;
        var _currentBlueprint = null;
        var _deploymentsList = [];
        $scope.emptyReason = $filter('translate')('hosts.chooseBlueprint');


        // keeps a map between deployment id to blueprint id
        var deployments = {};




        cloudifyClient.deployments.list('id,blueprint_id').then(function( result ){
            deployments = result.data;
            _.each(result.data, function(item){
                deployments[item.id] = item.blueprint_id;
            });
            $scope.blueprintsList = _.uniq(_.map(result.data, function( item ){ return { label : item.blueprint_id, value : item.blueprint_id } }, function(item){ return item.label; }));
            $scope.deploymentsList = _.uniq(_.map(result.data, function( item ){ return { label : item.id, value : item.id } }, function(item){ return item.label; }));
            console.log($scope.eventsFilter);
            console.log($scope.eventsFilter);
            loadNodeInstances();

        });

        function loadNodeInstances() {
            cloudifyClient.nodeInstances.list().then(function (result) {

                _.each(result.data, function(item){
                    item.blueprint_id = deployments[item.deployment_id];
                });
                $scope.nodesList = result.data;
                $scope.filterLoading = false;
                console.log('this is nodeInstances', result.data);
            });
        }

        function _execute() {
            $scope.emptyReason = null;
            $scope.filterLoading = true;
            $scope.nodesList = null;


        }

        $scope.getBlueprintId = function() {
            return _currentBlueprint;
        };

       $scope.$watch('hostsFilter', function(newValue){
           console.log('hosts filter changed', newValue );
           if ( !newValue ){
               return;
           }
            if(newValue !== null) {
                $scope.deploymentsList = $filter('listByList')(_deploymentsList, [newValue]);
                _blueprint = newValue.value;
            }
            else {
                $scope.deploymentsList = [];
                _blueprint = null;
            }
        }, true);


        $scope.execute = function() {
            if (!$scope.isSearchDisabled()) {
                _execute();
            }
        };

        $scope.hostsFilter = { blueprints : null, deployments : null  };

        $scope.isSearchDisabled = function() {
            return $scope.hostsFilter.blueprints === null || $scope.hostsFilter.blueprints.length === 0;
        };

    });
