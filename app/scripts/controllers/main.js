'use strict';

angular.module('cosmoUi')
    .controller('MainCtrl', function ($scope, YamlService, $routeParams ) {
        var appName = $routeParams.appName || "mezzanine-app";
        console.log(['appName is', appName]);
        YamlService.load('mezzanine-app','mezzanine_template.yaml', function( err, result ) {
            if ( err ){
                console.log(err);
                $scope.json = "ERROR : " + err.message;
            }else{
                $scope.json = result;
            }

        });

        $scope.asString = function(){
            return JSON.stringify($scope.json,0,4);
        }
    });
