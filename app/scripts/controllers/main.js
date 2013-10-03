'use strict';

angular.module('cosmoYamlApp')
    .controller('MainCtrl', function ($scope, yamlService) {
        yamlService.init(function() {
            $scope.json = yamlService.getJson();
        });
    });
