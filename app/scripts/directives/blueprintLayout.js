'use strict';

angular.module('cosmoUiApp')
    .directive('blueprintLayout', function ($location, BreadcrumbsService, CloudifyService) {
        return {
            templateUrl: 'views/blueprint/layout.html',
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                id: '=blueprintId',
                section: '@',
                selectview: '@'
            },
            link: function postLink($scope) {

                $scope.nodesTree = [];
                $scope.isDeployDialogVisible = false;
                $scope.toggleBar = {
                    'compute': true,
                    'middleware': true,
                    'modules': true,
                    'connections': true
                };
                $scope.selectedBlueprint = null;
                $scope.inputs = [];

                // Set Breadcrumb
                BreadcrumbsService.push('blueprints', {
                    href: '#/blueprints',
                    i18nKey: 'breadcrumb.blueprints',
                    id: 'blueprints'
                });

                CloudifyService.blueprints.getBlueprintById({id: $scope.id})
                    .then(function(blueprintData) {

                        // Verify it's valid page, if not redirect to blueprints page
                        if (blueprintData.hasOwnProperty('error_code')) {
                            $location.path('/blueprints');
                        }

                        // Emit deployment data
                        $scope.$emit('blueprintData', blueprintData);
                        $scope.selectedBlueprint = blueprintData;

                        // Add breadcrumbs for the current deployment
                        $scope.breadcrumb = [
                            {
                                href: '',
                                label: blueprintData.id,
                                id: 'blueprint'
                            }
                        ];

                    });

                $scope.$watch('breadcrumb', function (breadcrumbs) {
                    angular.forEach(breadcrumbs, function (breadcrumb) {
                        BreadcrumbsService.push('blueprints', breadcrumb);
                    });
                }, true);

                $scope.$watch('toggleBar', function(toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });

                // Set Navigation Menu
                $scope.navMenu = [
                    {
                        'name': 'Topology',
                        'href': '/topology'
                    },
                    {
                        'name': 'Network',
                        'href': '/network'
                    },
                    {
                        'name': 'Nodes',
                        'href': '/nodes'
                    },
                    {
                        'name': 'Source',
                        'href': '/source'
                    }
                ];

                $scope.isSectionActive = function (section) {
                    return section.name === $scope.section ? 'active' : '';
                };

                $scope.goToSection = function (section) {
                    $location.path('/blueprint/' + $scope.id + section.href);
                };

                $scope.toggleDeployDialog = function() {
                    $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
                };

                $scope.redirectToDeployment = function(deployment_id) {
                    $location.path('/deployment/' + deployment_id + '/topology');
                };
            }
        };
    });
