'use strict';

angular.module('cosmoUi')
    .directive('toolBar', function () {
        return {
            templateUrl: 'views/toolBarTemplate.html',
            restrict: 'E',
            link: function( element ) {
                $(element).on('.apps','click', function() {
                    console.log('apps button clicked');
                });

                $(element).on('.messages','click', function() {
                    console.log('messages button clicked');
                });
            }
        };
    });
