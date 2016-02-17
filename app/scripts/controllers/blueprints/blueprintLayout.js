'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:blueprints/blueprintLayoutCtrl
 * @description
 * # blueprints/blueprintLayoutCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('BlueprintLayoutCtrl', function ($scope, $location, cloudifyClient, CloudifyService, ngDialog, $stateParams, HotkeysManager) {
        $scope.blueprint = {
            id: $stateParams.blueprintId
        };

        cloudifyClient.blueprints.get($scope.blueprint.id)
            .then(function(result) {
                $scope.blueprint.description = result.data.description;
                return result.data;
            }, function(result) {
                if(result.status === 404) {
                    $scope.blueprintNotFound = true;
                } else {
                    $scope.loadError = CloudifyService.getErrorMessage(result);
                }
                // todo: handle other errors, apart from 404
            })
            .then(function(blueprintData) {

                // Verify it's valid page, if not redirect to blueprints page
                if (blueprintData.hasOwnProperty('error_code')) {
                    // todo: this seems wrong to me. we should display error instead
                    $location.path('/blueprints');
                }


                // Add breadcrumbs for the current deployment
                $scope.breadcrumb = [
                    {
                        href: false,
                        label: blueprintData.id,
                        id: 'blueprint'
                    }
                ];

            });

        // Set Navigation Menu
        $scope.navMenu = [
            { 'name': 'Topology', 'href': '/topology'},
            { 'name': 'Nodes', 'href': '/nodes'},
            { 'name': 'Source', 'href': '/source'}
        ];

        _.each($scope.navMenu, function(nm){
            if ( $location.path().indexOf(nm.href) >= 0){
                nm.active = true;
            }
            nm.href='#/blueprint/' + $scope.blueprint.id + nm.href;
        });

        $scope.redirectToDeployment = function(deployment_id) {
            $location.path('/deployment/' + deployment_id + '/topology');
        };

        $scope.redirectToBlueprints = function() {
            $location.path('/blueprints');
        };

        HotkeysManager.bindBlueprintActions($scope);
    });
