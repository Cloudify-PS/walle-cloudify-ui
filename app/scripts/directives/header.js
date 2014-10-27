'use strict';

angular.module('cosmoUiApp')
    .directive('header', function ($log, CloudifyService, appConfig) {
        return {
            templateUrl: 'views/headerTemplate.html',
            restrict: 'A',
            link: function postLink(scope, element) {
                scope.loggedUser = {
                    name: 'John Doe'
                };

                var currentVersion = appConfig.versions.ui.split('.').join('');
                if (currentVersion.indexOf('-') !== -1) {
                    currentVersion = currentVersion.substring(0, currentVersion.indexOf('-'));
                }

                CloudifyService.getLatestVersion(currentVersion)
                    .then(function(ver) {
                        var _currentVer = parseInt(currentVersion);
                        var _ver = parseInt(ver);
                        if (!isNaN(_ver)) {
                            scope.updateVersion = _ver > _currentVer;
                        } else {
                            scope.updateVersion = false;
                        }
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
