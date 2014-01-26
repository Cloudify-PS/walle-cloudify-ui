'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService) {

        var planData/*:PlanData*/ = null;

//        yamlService.getFilesList('/', function(data) {
//            $scope.files = data;
//        });

        $scope.section = 'general';

        $scope.$watch('section', function () {
            console.log('got a new section value');
        });

        $scope.planName = $routeParams.name;

        $scope.renderer = Render.Topology.D3;
        $scope.layouter = Layout.Topology.Tensor.init({'xyPositioning': 'relative'});

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprint?id=' + $routeParams.id + '&name=' + $scope.planName,
                label: $scope.planName,
                id: 'blueprint'
            });

        YamlService.load($routeParams.id, function (err, data) {
            planData = data;
            $scope.graph = data.getJSON();
        });

        $scope.showDirectory = function (directory) {
            console.log(directory.name);
            YamlService.getFilesList('/' + directory.name, function (data) {
                $scope.files = data;
            });
        };

        $scope.topologyHandlers = {
            'actionClick': function (data) {
                var node = data.node;
                var realNode = planData.getNode(node.id);
                $scope.showProperties = {
                    properties: planData.getProperties(realNode),
                    policies: planData.getPolicies(realNode),
                    general: planData.getGeneralInfo( realNode )
                };
            }
        };

        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };
    });
