'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams) {

//        yamlService.getFilesList('/', function(data) {
//            $scope.files = data;
//        });
        $scope.showFile = function (file) {
            console.log(file.name);
        };

        $scope.section = 'general';

        $scope.$watch('section', function () {
            console.log('got a new section value');
        });

        $scope.planName = $routeParams.name;

        $scope.renderer = Render.Topology.D3;
        $scope.layouter = Layout.Topology.Tensor.init({'xyPositioning': 'relative'});
        YamlService.load($routeParams.id, function (err, json) {
            $scope.graph = json;
        });

        $scope.showDirectory = function (directory) {
            console.log(directory.name);
            YamlService.getFilesList('/' + directory.name, function (data) {
                $scope.files = data;
            });
        };

        $scope.topologyHandlers = {
            'click': function (node) {
                $scope.showProperties = node;
            }
        };

        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };

//        $(document).on('click','svg', function(e, data){
//            $scope.$apply(function(){
//                console.log(["doing something on click",$scope.graph.nodes[1]]);
//
//                $scope.showProperties = $scope.graph.nodes[1];
//
//            })
//        })
    });
