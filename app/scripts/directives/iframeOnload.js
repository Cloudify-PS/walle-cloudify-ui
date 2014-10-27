'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:iframeOnload
 * @description
 * # iframeOnload
 */
angular.module('cosmoUiApp')
    .directive('iframeOnload', [function () {
        return {
            scope: {
                callBack: '&iframeOnload'
            },
            link: function ($scope, $element) {
                $element.on('load', function () {
                    return $scope.callBack();
                });
            }
        };
    }]);
