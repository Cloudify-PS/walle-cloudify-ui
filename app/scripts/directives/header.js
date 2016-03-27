'use strict';

angular.module('cosmoUiApp')
    .directive('header', function ($log, CloudifyService, LoginService, $location) {
        return {
            templateUrl: 'views/headerTemplate.html',
            restrict: 'A',
            link: function postLink(scope, element) {
                scope.navbarItems=[
                    {
                        'route': 'blueprints',
                        'label': 'Blueprints',
                        'otherRoutes': ['blueprint']
                    },
                    {
                        'route': 'deployments',
                        'label': 'Deployments',
                        'otherRoutes': ['deployment']
                    },
                    {
                        'route': 'logs',
                        'label': 'Logs & Events'
                    },
                    {
                        'route': 'nodes-instances',
                        'label': 'Nodes Instances'
                    }
                ];
                scope.isActive = function(routeItem){
                    var currentRoute = $location.path();
                    var allRoutes = [routeItem.route];
                    _.each(routeItem.otherRoutes, function(route){
                        allRoutes.push(route);
                    });
                    return allRoutes.indexOf(currentRoute.split('/')[1]) !== -1;
                };

                scope.loggedUser = {
                    name: 'John Doe'
                };

                CloudifyService.version.needUpdate().then(function (result) {
                    scope.updateVersion = typeof(result) === 'boolean' ? result : false;
                });

                scope.searchCloudify = function () {
                    $log.info('search ' + element.find('#search-field').val());
                };

                scope.logout = function () {
                    LoginService.logout(true);
                };

                LoginService.isLoggedIn().then(function (result) {
                    scope.isLoggedIn = result.data.result;
                    scope.username = result.data.username;
                });
            }
        };
    });
