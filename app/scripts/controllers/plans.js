'use strict';

angular.module('cosmoYamlApp')
    .controller('PlansCtrl', function ($scope, yamlService) {
        yamlService.getFilesList('/', function(data) {
            $scope.files = data;
        });

        $scope.showFile = function(file) {
            console.log(file.name);
        };

        $scope.showDirectory = function(directory) {
            console.log(directory.name);
            yamlService.getFilesList('/' + directory.name, function(data) {
                $scope.files = data;
            });
        };
    });
