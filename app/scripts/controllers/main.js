'use strict';

angular.module('cosmoUi')
    .controller('MainCtrl', function ($scope, YamlService) {
        YamlService.init('integration-phase4.yaml', function() {
            $scope.json = YamlService.getJson();
        });

        $scope.asString = function(){
            return JSON.stringify($scope.json,0,4);
        }
    });
