'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService, Cosmotypesservice) {

        var planData/*:PlanData*/ = null;
        var dataPlan;
        $scope.section = 'topology';
        $scope.propSection = 'general';
        $scope.toggleView = false;
        $scope.map = [];
        $scope.indexNodes = {};

        $scope.toggleBar = {
            'compute': true,
            'middleware': true,
            'modules': true,
            'connections': true
        };

        $scope.isDeployDialogVisible = false;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprint?id=' + $routeParams.id,
                label: $routeParams.id,
                id: 'blueprint'
            });

        YamlService.load($routeParams.id, function (err, data) {

            planData = data;
            dataPlan = data.getJSON();
            var dataMap;

            RestService.getBlueprintById({id: $routeParams.id})
                .then(function(data) {
                    $scope.blueprint = data || null;
                });

            /**
             * Networks
             */
            // Filter data for Networks
            var networks = PlanDataConvert.nodesToNetworks(dataPlan);
            $scope.networks = networks;
            bpNetworkService.setMap(networks.relations);


            // Render Networks
            $timeout(function(){
                $scope.networkcoords = bpNetworkService.getCoordinates();
                bpNetworkService.render();
            }, 100);

            /**
             * Blueprint
             */
            var topology = PlanDataConvert.nodesToTopology(dataPlan);

            // Convert edges to angular format
            if (topology.hasOwnProperty('edges') && !!topology.edges) {
                dataMap = PlanDataConvert.edgesToBlueprint(topology.edges);
            }

            PlanDataConvert.allocateAbandonedNodes(topology, dataMap);

            blueprintCoordinateService.resetCoordinates();

            // Set Map
            blueprintCoordinateService.setMap(dataMap.connected);

            // Connection between nodes
            if(dataMap.hasOwnProperty('contained')) {
                $scope.map = _mergeNodeData(dataMap.contained.reverse());
            }
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
            $scope.dataTable = PlanDataConvert.nodesToTable(dataPlan);
            RestService.getBlueprintSource($routeParams.id)
                .then(function(code) {
                    $scope.dataCode = {
                        data: code.source
                    };
                });
        });

        function _mergeNodeData(nodesMap) {
            for (var i = 0; i < nodesMap.length; i++) {
                dataPlan.nodes.forEach(function (node) {
                    if (nodesMap[i].id === node.id) {
                        for (var attr in node) {
                            nodesMap[i][attr] = node[attr];
                        }
                        nodesMap[i].type = Cosmotypesservice.getTypeData(node.type[0]);

                        if (nodesMap[i].children !== undefined && nodesMap[i].children.length > 0) {
                            for (var j = 0; j < nodesMap[i].children.length; j++) {
                                nodesMap[i].children = _mergeNodeData(nodesMap[i].children);
                            }
                        }
                    }
                });
            }
            return nodesMap;
        }


        $scope.viewNode = function (node_id) {
            var realNode = planData.getNode(node_id);
            $scope.showProperties = {
                properties: planData.getProperties(realNode),
                relationships: planData.getRelationships(realNode),
                general: planData.getGeneralInfo(realNode)
            };
        };

        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };

        $scope.toggleDeployDialog = function() {
            $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
        };

        $scope.redirectToDeployment = function(deployment_id, blueprint_id) {
            $location.path('/deployment').search({id: deployment_id, blueprintId: blueprint_id});
        };

        $scope.getContainerClass = function(node_id) {

            for (var node in $scope.indexNodes) {
                if ($scope.indexNodes[node].id === node_id) {
                    return $scope.indexNodes[node].type.baseType.replace('_', '-');
                }
            }
            return '';
        };
    });