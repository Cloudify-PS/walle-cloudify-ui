'use strict';

angular.module('cosmoUi')
    .directive('breadcrumbs', function(BreadcrumbsService) {
    return {
        restrict: 'EA',
        templateUrl: 'views/breadcrumbsTemplate.html',
        replace: true,
        link: function($scope, $attr) {
            var bc_id = $attr[0].id;

            function resetCrumbs() {
                $scope.breadcrumbs = [];
                angular.forEach(BreadcrumbsService.get(bc_id), function(v) {
                    $scope.breadcrumbs.push(v);
                });
            }

            $scope.unregisterBreadCrumb = function(index) {
                BreadcrumbsService.setLastIndex(bc_id, index);
                resetCrumbs();
            };

            resetCrumbs();
        }
    };

});