'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, $routeParams, PlanDataConvert, blueprintCoordinateService) {

        var planData/*:PlanData*/ = null;
        $scope.section = "general";
        $scope.planName = $routeParams.name;

        $scope.toggleBar = {
            "compute": true,
            "middleware": true,
            "modules": true,
            "connections": true
        };

        YamlService.load($routeParams.id, function (err, data) {

            planData = data;
            var dataPlan = data.getJSON(),
                dataMap;

            // Convert edges to angular format
            if (dataPlan.hasOwnProperty("edges") && !!dataPlan.edges){
                dataMap = PlanDataConvert.edgesToAngular(dataPlan.edges);
            }

            // Index data by ID
            if (dataPlan.hasOwnProperty("nodes") && !!dataPlan.nodes){
                $scope.indexNodes = {};
                dataPlan.nodes.forEach(function(node){
                    $scope.indexNodes[node.id] = node;
                });
            }

            // Set Map
            blueprintCoordinateService.setMap(dataMap["cloudify.relationships.connected_to"]);

            // Connection between nodes
            $scope.map = dataMap["cloudify.relationships.contained_in"];
            $scope.coordinates = blueprintCoordinateService.getCoordinates();

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
