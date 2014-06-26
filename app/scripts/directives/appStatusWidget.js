'use strict';

angular.module('cosmoUiApp')
    .directive('appStatusWidget', function () {
        return {
            templateUrl: 'views/appStatusWidgetTemplate.html',
            require: '?ngModel',
            transclude: true,
            restrict: 'EA',
            link: function ($scope, $element, $attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                ngModel.$render = function () {
                    $scope.status = ngModel.$viewValue || {};
                    $scope.total = 0;
                    angular.forEach($scope.status, function(value){
                        $scope.total += value;
                    });
                };
            }
        };
    });
