'use strict';

angular.module('cosmoUi')
    .directive('header', function () {
        return {
            template: '<div class="logo"></div>' +
                '<div class="current-user"></div> ' +
                '<div class="search-box"></div> ',
            restrict: ' A'//,
        //      link: function postLink(scope, element, attrs) {
        //      }
        };
    });
