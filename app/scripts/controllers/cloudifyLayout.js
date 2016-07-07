'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:CloudifyLayoutCtrl
 * @description
 * # CloudifyLayoutCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('CloudifyLayoutCtrl', function ($scope, $stateParams, VersionService, $window, HotkeysManager, appConfig) {
        $scope.embeded = $window !== $window.top;
        if ( $stateParams.hasOwnProperty('embed')  ) { // override
            $scope.embeded = $stateParams.embed === 'true';
        }

        VersionService.getVersions().then(function(versions) {
            $scope.versions = versions;
        });

        $scope.uiVariation = appConfig.uiVariation;

        HotkeysManager.bindNavigations($scope);
    });
