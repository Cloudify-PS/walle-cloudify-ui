'use strict';

angular.module('cosmoUi')
    .directive('header', ['WhiteLabel', function (WhiteLabel) {
        return {
            templateUrl: 'views/headerTemplate.html',
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

                scope.classname = function (filename) {
                    return WhiteLabel.classname(filename);
                };
            }
        };
    }]);
