'use strict';

angular.module('cosmoUiApp')
    .directive('breadcrumbs', function () {
        return {
            restrict: 'A',
            templateUrl: 'views/breadcrumbsTemplate.html',
            replace: true,
            scope:{
                'breadcrumbs' : '='
            },
            link: function (/*$scope, $attr*/) {

            }

        };
    });
