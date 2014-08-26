'use strict';

angular.module('cosmoUiApp')
    .directive('blueprintLayout', function ($location, $route, BreadcrumbsService) {
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
                $scope.breadcrumb = [];
                $scope.toggleBar = {
                    'compute': true,
                    'middleware': true,
                    'modules': true,
                    'connections': true
                };

                // Set Breadcrumb
                BreadcrumbsService.push('blueprints', {
                    href: '#/blueprints',
                    i18nKey: 'breadcrumb.blueprints',
                    id: 'blueprints'
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
            }
        };
    });
