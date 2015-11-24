'use strict';

angular.module('cosmoUiApp')
    .directive('header', function ($log, CloudifyService, LoginService ) {
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
                    LoginService.logout(true);
                };

                LoginService.isLoggedIn().then(function(result){
                    scope.isLoggedIn = result.data.result;
                    scope.username = result.data.username;
                    user.loggedIn = result.data.result;
                });
            }
        };
    });
