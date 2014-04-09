'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService, Cosmotypesservice) {

        var planData/*:PlanData*/ = null;
        $scope.section = 'topology';
        $scope.propSection = 'general';
        $scope.toggleView = false;

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
            var dataPlan = data.getJSON(),
                dataMap;

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

            // Index data by ID
            if (dataPlan.hasOwnProperty('nodes') && !!dataPlan.nodes) {
                $scope.indexNodes = {};
                dataPlan.nodes.forEach(function (node) {
                    $scope.indexNodes[node.id] = node;
                    $scope.indexNodes[node.id].type = Cosmotypesservice.getTypeData(node.type[0]);
                });
            }

            // Set Map
            blueprintCoordinateService.setMap(dataMap.connected);

            // Connection between nodes
            if(dataMap.hasOwnProperty('contained')) {
                $scope.map = dataMap.contained.reverse();
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


        $scope.viewNode = function (node) {
            var realNode = planData.getNode(node.id);
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

        $scope.redirectToDeployments = function(blueprint) {
            $location.path('/deployments').search({blueprint_id: blueprint.id});
        };
    });
