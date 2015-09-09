'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, $filter, cloudifyClient ) {


        /**
         * Hosts
         */
        $scope.typesList = [];
        var _blueprint = null;
        var _currentBlueprint = null;
        var matchFilter = {};

        var allNodes = []; // unfiltered

        $scope.emptyReason = $filter('translate')('hosts.chooseBlueprint');


        // keeps a map between deployment id to blueprint id
        var deployments = {};
        var allDeployments = [];


        function resetTypesList(){
            $scope.typesList = [ { 'value' : 'cloudify.nodes.Compute', 'label' : 'cloudify.nodes.Compute' } ];
        }
        resetTypesList();



        cloudifyClient.deployments.list('id,blueprint_id').then(function( result ){

            _.each(result.data, function(item){
                deployments[item.id] = item.blueprint_id;
            });
            $scope.blueprintsList = _.map(_.uniq(result.data, 'blueprint_id' ), function( item ){ return { label : item.blueprint_id, value : item.blueprint_id } });
            allDeployments = _.map(_.uniq(result.data, 'id'),function( item ){ return { label : item.id, value : item.id } });
            console.log($scope.eventsFilter);
            console.log($scope.eventsFilter);
            loadNodeInstances();

        });

        /** load all node instances...
         *  load nodes to get types
         *  map blueprint_id to each node_instance
         */
        function loadNodeInstances() {
            cloudifyClient.nodes.list().then(function(result){

                var types = [];

                // { deployment_id : { node_id: hierarchy type } }
                var typesByDeploymentAndNode = {};


                _.each(_.groupBy(result.data,'deployment_id'), function(value, key){
                    typesByDeploymentAndNode[key] = _.indexBy(value, 'id');
                });
                console.log('this is types',typesByDeploymentAndNode);

                _.each(result.data, function(item){
                     types = types.concat(item.type_hierarchy);
                });

                types = _.map(_.uniq(types), function(item){ return {'value' : item, 'label' : item }});
                $scope.typesList = types;

                cloudifyClient.nodeInstances.list().then(function (result) {

                    _.each(result.data, function(item){
                        item.blueprint_id = deployments[item.deployment_id];


                        item.type_hierarchy = typesByDeploymentAndNode[item.deployment_id][item.node_id].type_hierarchy;
                    });
                    allNodes = result.data;

                    $scope.filterLoading = false;
                    filterItems();
                    //console.log('this is nodeInstances', result.data);
                });

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

        $scope.total = function(){
            return allNodes.length;
        };

        function filterItems(){
            buildMatchFilter();
            $scope.nodesList = _.filter(allNodes, matchItem );


        }

        function  matchItem (item) {
            if (matchFilter.blueprint) { // filter by blueprint
                if (item.blueprint_id !== matchFilter.blueprint) {
                    return false;
                }
            }

            if (matchFilter.deployments) {
                if (item.deployment_id.indexOf(matchFilter.deployments) < 0) {
                    return false;
                }
            }

            if (matchFilter.types) {
                if (_.intersection(item.type_hierarchy, matchFilter.types).length === 0) {
                    return false;
                }
            }

            return true;

        };

        /**
         * while the hosts filter is used for display, the matchFilter is used for matching each item
         */
        function buildMatchFilter(){
            matchFilter = { };
            if ( !!$scope.hostsFilter.blueprint ){
                matchFilter.blueprint = $scope.hostsFilter.blueprint.value;
            }

            if ( !!$scope.hostsFilter.deployments && $scope.hostsFilter.deployments.length > 0){
                matchFilter.deployments = _.pluck($scope.hostsFilter.deployments,'value');
            }

            if ( !!$scope.hostsFilter.types && $scope.hostsFilter.types.length > 0){
                matchFilter.types = _.pluck($scope.hostsFilter.types,'value');
            }
        }

       $scope.$watch('hostsFilter', function(newValue){
           console.log('hosts filter changed', newValue );
           if ( !newValue ){
               return;
           }
           if(!!$scope.hostsFilter.blueprint) { //  todo: change only when blueprint changes..
                $scope.deploymentsList = _.filter( allDeployments, function( item ){ return deployments[item.label] === $scope.hostsFilter.blueprint.label });
                _blueprint = newValue.value;
           }

           filterItems();

        }, true);


        $scope.execute = function() {
            if (!$scope.isSearchDisabled()) {
                _execute();
            }
        };

        $scope.clearFilter = function() {
            $scope.hostsFilter = {blueprint: null, deployments: null, types:null, search: null};
        };

        $scope.clearFilter();

        $scope.isSearchDisabled = function() {
            return $scope.hostsFilter.blueprints === null || $scope.hostsFilter.blueprints.length === 0;
        };

    });
