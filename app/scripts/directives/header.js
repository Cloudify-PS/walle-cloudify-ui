'use strict';

angular.module('cosmoUi')
    .directive('header', function () {
        return {
            template: '<div class="logo" ng-class="whitelabelClassname(\'cloudify-logo\')"></div>' +
                '<!--div class="current-user">' +
                    '<div id="user-icon"></div> ' +
                    '<div id="user-name">{{loggedUser.name}}</div> ' +
                    '<div id="logout-button" ng-click="logout()"></div> ' +
                '</div> ' +
                '<div class="search-box">' +
                    '<input type="text" id="search-field" placeholder="Search on Cloudify..">' +
                    '<input type="button" id="search-submit" ng-click="searchCloudify()">' +
                '</div--> ',
            restrict: ' A',
            link: function postLink(scope, element) {
                scope.loggedUser = {
                    name: 'John Doe'
                };

                scope.searchCloudify = function() {
                    console.log('search ' + element.find('#search-field').val());
                };

                scope.logout = function() {
                    console.log('logout');
                };

                // TODO function to service, scope holds binded variable only
                scope.whitelabelClassname = function (filename) {
                    // TODO from server (use variable in gruntfile AND in whitelabel service)
                    var whitelabelPrefix = 'whitelabel-';
                    var whitelabelColorSuffix = '-0'; // may be absent
                    return whitelabelPrefix + filename + whitelabelColorSuffix;
                }
            }
        };
    });
