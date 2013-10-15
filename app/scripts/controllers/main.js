'use strict';

angular.module('cosmoUi')
    .controller('MainCtrl', function ($scope, yamlService) {
        yamlService.init('integration-phase4.yaml', function() {
            $scope.json = yamlService.getJson();
        });
    });
