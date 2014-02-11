'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout) {

        var planData/*:PlanData*/ = null;
        $scope.section = 'topology';
        $scope.planName = $routeParams.name;
        $scope.toggleView = false;

        $scope.toggleBar = {
            'compute': true,
            'middleware': true,
            'modules': true,
            'connections': true
        };

        BreadcrumbsService.push('blueprints', {
            href: '#/blueprint?id=' + $routeParams.id + '&name=' + $scope.planName,
            label: $scope.planName,
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
            }, 1500);


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
            $scope.dataCode = dataPlan;

            // Get Icon by Type
            $scope.getIcon = function (type) {
                switch (type) {
                case 'server':
                    return 'app-server';
                case 'host':
                    return 'host';
                }
            };

        });


        $scope.viewNode = function (node) {
            var realNode = planData.getNode(node.id);
            $scope.showProperties = {
                properties: planData.getProperties(realNode),
                policies: planData.getPolicies(realNode),
                general: planData.getGeneralInfo(realNode)
            };
            console.log($scope.showProperties);
        };


        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };
    });
