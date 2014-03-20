'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService) {

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

            /**
             * Networks
             */
            // Filter data for Networks
            PlanDataConvert.nodesToNetworks(dataPlan);
            $scope.networks = dataPlan.network;
            bpNetworkService.setMap(dataPlan.network.relations);

            // Render Networks
            $timeout(function(){
                $scope.networkcoords = bpNetworkService.getCoordinates();
                bpNetworkService.render();
            }, 100);

            /**
             * Blueprint
             */
            // Convert edges to angular format
            if (dataPlan.hasOwnProperty('edges') && !!dataPlan.edges) {
                dataMap = PlanDataConvert.edgesToBlueprint(dataPlan.edges);
            }

            // Index data by ID
            if (dataPlan.hasOwnProperty('nodes') && !!dataPlan.nodes) {
                $scope.indexNodes = {};
                dataPlan.nodes.forEach(function (node) {
                    $scope.indexNodes[node.id] = node;
                });
            }

            // Set Map
            blueprintCoordinateService.setMap(dataMap['cloudify.relationships.connected_to']);

            // Connection between nodes
            $scope.map = dataMap['cloudify.relationships.contained_in'];
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
            $scope.dataTable = PlanDataConvert.nodesToTable(dataPlan);
            RestService.getBlueprintSource($routeParams.id)
                .then(function(code) {
                    $scope.dataCode = {
                        data: code.source
                    };
                });

            // Get Icon by Type
            $scope.getIcon = function (type) {
                switch (type) {
                case 'server':
                    return 'app-server';
                case 'host':
                    return 'host';
                case 'router':
                    return 'router';
                default:
                    return type;
                }
            };

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
            RestService.getBlueprintById({id: $routeParams.id})
                .then(function(data) {
                    $scope.blueprint = data || null;
                    $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
                });
        };

        $scope.redirectToDeployments = function(blueprint) {
            $location.path('/deployments').search({blueprint_id: blueprint.id});
        };

        SyntaxHighlighter.all();
    });
