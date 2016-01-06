'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:uploadBlueprintButton
 * @description
 * # uploadBlueprintButton
 */
angular.module('cosmoUiApp')
    .directive('uploadBlueprintButton', function (ngDialog, $location) {
        return {
            templateUrl: 'views/directives/uploadBlueprintButton.html',
            restrict: 'A',
            transclude: true,
            scope: {},
            link: function postLink(scope) {

                scope.openAddDialog = function () {
                    ngDialog.open({
                        template: 'views/blueprint/uploadDialog.html',
                        controller: 'UploadBlueprintDialogCtrl',
                        scope: scope,
                        className: 'upload-dialog'
                    });
                };

                scope.uploadDone = function (blueprint_id) {
                    $location.path('/blueprint/' + blueprint_id + '/topology');
                };

            }
        };
    });
