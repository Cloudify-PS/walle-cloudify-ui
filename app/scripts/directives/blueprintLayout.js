'use strict';

angular.module('cosmoUiApp')
    .directive('blueprintLayout', function ($location, cloudifyClient, ngDialog, $routeParams) {
        return {
            templateUrl: 'views/blueprint/blueprintLayout.html',
            restrict: 'C',
            transclude: true,
            scope: {
                section: '@',
                selectview: '@'
            },
            link: function postLink($scope) {

                $scope.blueprintId = $routeParams.blueprintId;


                cloudifyClient.blueprints.get($scope.blueprintId)
                    .then(function( result ){ return result.data;  })// strip result // todo: handle error
                    .then(function(blueprintData) {

                        // Verify it's valid page, if not redirect to blueprints page
                        if (blueprintData.hasOwnProperty('error_code')) {
                            // todo: this seems wrong to me. we should display error instead
                            $location.path('/blueprints');
                        }

                        // Emit deployment data
                        $scope.$emit('blueprintData', blueprintData);
                        $scope.selectedBlueprint = blueprintData;

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
                    { 'name': 'Network', 'href': '/network'},
                    { 'name': 'Nodes', 'href': '/nodes'},
                    { 'name': 'Source', 'href': '/source'}
                ];

                _.each($scope.navMenu, function(nm){
                    if ( $location.path().indexOf(nm.href) >= 0){
                        nm.active = true;
                    }
                    nm.href='#/blueprint/' + $scope.blueprintId + nm.href;
                });

                $scope.isSectionActive = function (section) {
                    return section.name === $scope.section ? 'active' : '';
                };

                if ( !$scope.openDeployDialog ) { // allow tests to override this function..
                    $scope.openDeployDialog = function () {
                        ngDialog.open({
                            template: 'views/blueprint/deployBlueprintDialog.html',
                            controller: 'DeployDialogCtrl',
                            scope: $scope,
                            className: 'deploy-dialog'
                        });
                    };
                }

                $scope.redirectToDeployment = function(deployment_id) {
                    $location.path('/deployment/' + deployment_id + '/topology');
                };

                $scope.redirectToBlueprints = function() {
                    $location.path('/blueprints');
                };

            }
        };
    });
