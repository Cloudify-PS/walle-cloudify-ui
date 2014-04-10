'use strict';

angular.module('cosmoUi')
    .directive('toolBar', function ($log) {
        return {
            templateUrl: 'views/toolBarTemplate.html',
            restrict: 'E',
            link: function( element ) {
                $(element).on('.apps','click', function() {
                    $log.info('apps button clicked');
                });

                $(element).on('.messages','click', function() {
                    $log.info('messages button clicked');
                });
            }
        };
    });
