'use strict';

angular.module('cosmoUi')
    .directive('header', function ($log) {
        return {
            templateUrl: 'views/headerTemplate.html',
            restrict: ' A',
            link: function postLink(scope, element) {
                scope.loggedUser = {
                    name: 'John Doe'
                };

                scope.searchCloudify = function() {
                    $log.info('search ' + element.find('#search-field').val());
                };

                scope.logout = function() {
                    $log.info('logout');
                };
            }
        };
    });
