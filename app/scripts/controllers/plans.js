'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams) {

//        yamlService.getFilesList('/', function(data) {
//            $scope.files = data;
//        });
        $scope.showFile = function (file) {
            console.log(file.name);
        };

        $scope.renderer = Render.Topology.D3;
        $scope.layouter = Layout.Topology.Tensor.init({"xyPositioning":"relative"});
        YamlService.load($routeParams.folder, $routeParams.file, function( err, json ){
            console.log(json);
            $scope.graph = json;
        } );

        $scope.showDirectory = function (directory) {
            console.log(directory.name);
            YamlService.getFilesList('/' + directory.name, function (data) {
                $scope.files = data;
            });
        };
    });
