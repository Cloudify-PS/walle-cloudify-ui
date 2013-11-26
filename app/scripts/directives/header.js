'use strict';

angular.module('cosmoUi')
    .directive('header', function () {
        return {
            template: '<div class="logo"></div>' +
                '<div class="current-user">' +
                    '<div id="user-icon"></div> ' +
                    '<div id="user-name">{{loggedUser.name}}</div> ' +
                    '<div id="logout-button"></div> ' +
                '</div> ' +
                '<div class="search-box">' +
                    '<input type="text" id="search-field" placeholder="Search on Cloudify..">' +
                    '<input type="button" id="search-submit">' +
                '</div> ',
            restrict: ' A',
            link: function postLink(scope) {
                scope.loggedUser = {
                    name: 'John Doe'
                };
            }
        };
    });
