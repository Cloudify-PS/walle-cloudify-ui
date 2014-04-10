'use strict';

angular.module('cosmoUi')
    .controller('MainCtrl', function ($scope, YamlService, $routeParams, $log) {
        var appName = $routeParams.name || 'mezzanine-app';
        $log.info(['appName is', appName]);
        YamlService.load($routeParams.id, function (err, result) {
            if (err) {
                $log.info(err);
                $scope.json = 'ERROR : ' + err.message;
            } else {
                $scope.dataContainer = result;
                $scope.json = result.getJSON();
                $scope.yaml = YAML.stringify($scope.json, 999, 4);
            }

        });

        $scope.asString = function () {
            return JSON.stringify($scope.json, 0, 4);
        };
    });
