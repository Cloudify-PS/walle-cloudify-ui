'use strict';

angular.module('cosmoUiApp')
    .directive('header', function ($log, CloudifyService) {
        return {
            templateUrl: 'views/headerTemplate.html',
            restrict: 'A',
            link: function postLink(scope, element) {
                scope.loggedUser = {
                    name: 'John Doe'
                };

                CloudifyService.version.needUpdate().then(function(result) {
                    scope.updateVersion = typeof(result) === 'boolean'? result : false;
                });

                scope.searchCloudify = function() {
                    $log.info('search ' + element.find('#search-field').val());
                };

                scope.logout = function() {
                    $log.info('logout');
                };
            }
        };
    });
