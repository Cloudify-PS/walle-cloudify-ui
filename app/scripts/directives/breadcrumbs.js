'use strict';

angular.module('cosmoUiApp')
    .directive('breadcrumbs', function (BreadcrumbsService) {
        return {
            restrict: 'EA',
            templateUrl: 'views/breadcrumbsTemplate.html',
            replace: true,
            link: function ($scope, $attr) {
                $scope.breadcrumbs = BreadcrumbsService.get($attr[0].id);
            }
        };
    });