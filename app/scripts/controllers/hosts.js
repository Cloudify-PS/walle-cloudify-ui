'use strict';

/**
 * @module HostsCtrl //todo: change to NodeCtrl
 * @description builds the required information for the nodes page
 */
/**
 * @typedef {object} HostsCtrl~MatchFilter
 * @description an object to keep all filter information for matching algorithm since it is not easy to use HostsFilter which is for display purposes.
 * @property {Array<string>} types all types to filter by
 * @property {string} blueprint - the selected blueprint id
 * @property {Array<string>} deployments - the deployments id selected by filter. - if none are selected you should use all the deployments matching the blueprint.
 */
/**
 * @typedef {object} MultiSelectItem
 * @description an item required by directive "multi-select"
 * @property {string} label
 * @property {string} value
 */
/**
 * @typedef {object} HostsCtrl~HostsFilter
 * @description an object to keep all filtering information display. when used, it is then converted to {@link HostsCtrl~MatchFilter}
 * @property {MultiSelectItem} blueprint - the selected blueprint. user allowed to pick just one. initializes to first blueprint.
 * @property {Array<MultiSelectItem>} deployments - filter by deployments. affected by the selected blueprint. multiple selection allowed.
 * @property {string} search - free text search
 * @property {Array<MultiSelectItem>} types - node types filter. multiple selection allowed. initializes with Compute type.
 */

angular.module('cosmoUiApp')// todo : change to NodeCtrl
    .controller('HostsCtrl', function ($scope, $filter, cloudifyClient, $q) {

        $scope.typesList = [];
        var _blueprint = null;
        var matchFilter = {};
        // { deployment_id : { node_id: hierarchy type } }
        var typesByDeploymentAndNode = {};

        var allNodes = []; // unfiltered

        $scope.emptyReason = $filter('translate')('hosts.chooseBlueprint');

        // keeps a map between deployment id to blueprint id
        var deployments = {};
        var allDeployments = [];

        /**
         * @description clears the filter completely.
         * @see HostsFilter
         */
        $scope.clearFilter = function () {
            $scope.hostsFilter = {
                blueprint: null,
                deployments: null,
                types: null,
                search: null
            };
        };

        $scope.clearFilter();

        /**
         * @description initializes the types filter to Compute
         * @see HostsFilter
         */
        function resetTypesFilter() {
            $scope.hostsFilter.types = [{
                'value': 'cloudify.nodes.Compute',
                'label': 'cloudify.nodes.Compute'
            }];
        }

        // since the api does not allow us to query for multiple deployments at once, we need to create a request per deployment
        function getInstancesForDeployments() {
            // get node instances for each specific deployments. keep the promises.
            var requests = _.map(matchFilter.deployments, function (dep) {
                return cloudifyClient.nodeInstances.list(dep);
            });
            // wait for all promises and concatenate them.
            return $q.all(requests).then(function () {
                return {data: _.flatten(_.pluck(_.flatten(arguments), 'data.items'))};
            });
        }

        // lets get all deployments and construct the blueprint/deployment filters.
        function loadDeploymentsAndBlueprints() {
            cloudifyClient.deployments.list('id,blueprint_id').then(function (result) {
                // map deployment id to blueprint id
                _.each(result.data.items, function (item) {
                    deployments[item.id] = item.blueprint_id;
                });
                // construct the blueprints list by uniquely taking the blueprint_id from each deployment
                $scope.blueprintsList = _.map(_.uniq(result.data.items, 'blueprint_id'), function (item) {
                    return {label: item.blueprint_id, value: item.blueprint_id};
                });
                // initialize the filter to first blueprint
                if ($scope.blueprintsList.length > 0) {
                    $scope.hostsFilter.blueprint = $scope.blueprintsList[0];
                }
                // construct the deployments filter
                allDeployments = _.map(result.data.items, function (item) {
                    return {label: item.id, value: item.id};
                });
            });
        }

        loadDeploymentsAndBlueprints();

        /** load all node instances...
         *  load nodes to get types
         *  map blueprint_id to each node_instance
         */
        function loadNodeInstances() {
            $scope.getNodesError = null;
            $scope.filterLoading = true;
            $q.all([getInstancesForDeployments(), loadTypesData()]).then(function (result) {

                result = result[0];
                _.each(result.data, function (item) {
                    item.blueprint_id = deployments[item.deployment_id];

                    item.type_hierarchy = typesByDeploymentAndNode[item.deployment_id][item.node_id].type_hierarchy;
                });
                allNodes = result.data;

                $scope.filterLoading = false;
                filterItems();
            }, function (result) {
                $scope.getNodesError = result.data.message;
                $scope.filterLoading = false;
                $scope.emptyReason = result.data.message;
            });

        }

        // make this function only run once
        var typeDataPromise = null;
        // we need type data to filter by type. lets make types a filter on the way
        // we want to access types by deployment + node_id .. so we will have to reconstruct the result to match our needs
        function loadTypesData(reload) {
            if (typeDataPromise === null || reload) { // if promise exists, returns existing promise.
                // list all nodes. get only the required data
                typeDataPromise = cloudifyClient.nodes.list(null, null, 'deployment_id,id,type_hierarchy').then(function (result) {
                    var types = [];
                    // reconstruct the response to be by deployment_id and by type. allows easy access when we have a node instance.
                    _.each(_.groupBy(result.data.items, 'deployment_id'), function (value, key) {
                        typesByDeploymentAndNode[key] = _.indexBy(value, 'id');
                    });

                    // construct the types filter by joining together all the types we found
                    _.each(result.data.items, function (item) {
                        types = types.concat(item.type_hierarchy);
                    });
                    types = _.map(_.uniq(types), function (item) {
                        return {'value': item, 'label': item};
                    });
                    $scope.typesList = types;

                    // we want to start with a certain filter setting.
                    resetTypesFilter();

                });
            }
            return typeDataPromise;
        }

        loadTypesData();

        function filterItems() {
            $scope.nodesList = _.filter(allNodes, matchItem);
        }

        /**
         * @description filters node instances according to matchFilter
         * @param item
         * @returns {boolean}
         */
        function matchItem(item) {
            if (matchFilter.types) {
                if (_.intersection(item.type_hierarchy, matchFilter.types).length === 0) {
                    return false;
                }
            }
            return true;
        }

        /**
         * while the hosts filter is used for display, the matchFilter is used for matching each item
         * this structure is much easier to use in functions
         */
        function buildMatchFilter() {
            matchFilter = {};
            if (!!$scope.hostsFilter.blueprint) {
                matchFilter.blueprint = $scope.hostsFilter.blueprint.value;
            }

            // if deployments are selected, use them. otherwise get all deployments for blueprint
            if (!!$scope.hostsFilter.deployments && $scope.hostsFilter.deployments.length > 0) {
                matchFilter.deployments = _.pluck($scope.hostsFilter.deployments, 'value');
            } else if (!!matchFilter.blueprint) { // get all selected deployments for blueprint
                matchFilter.deployments = _.pluck($scope.deploymentsList, 'value');
            }

            if (!!$scope.hostsFilter.types && $scope.hostsFilter.types.length > 0) {
                matchFilter.types = _.pluck($scope.hostsFilter.types, 'value');
            }
        }

        function onHostsFilterChange(newValue) {
            if (!newValue) {
                return;
            }
            if (!!$scope.hostsFilter.blueprint) { //  todo: change only when blueprint changes..
                $scope.deploymentsList = _.filter(allDeployments, function (item) {
                    return deployments[item.label] === $scope.hostsFilter.blueprint.label;
                });
                _blueprint = newValue.value;
            }

            buildMatchFilter();
            loadNodeInstances();
            filterItems();
        }

        // on each change, lets rebuild the page
        $scope.$watch('hostsFilter', onHostsFilterChange, true);

        $scope.clearFilter();

        ///////////////////////
        /// for test purposes. do not use
        /////////////////////////

        $scope.resetTypesFilter = resetTypesFilter;
        $scope.getInstancesForDeployments = getInstancesForDeployments;
        $scope.loadDeploymentsAndBlueprints = loadDeploymentsAndBlueprints;
        $scope.loadNodeInstances = loadNodeInstances;
        $scope.loadTypesData = loadTypesData;
        $scope.matchItem = matchItem;
        $scope.buildMatchFilter = buildMatchFilter;
        $scope.onHostsFilterChange = onHostsFilterChange;
        $scope.getDeployments = function () {
            return deployments;
        };
        $scope.getTypesByDeploymentAndNode = function () {
            return typesByDeploymentAndNode;
        };
        $scope.setMatchFilter = function (_matchFilter) {
            matchFilter = _matchFilter;
        };
        $scope.getMatchFilter = function () {
            return matchFilter;
        };

    });
