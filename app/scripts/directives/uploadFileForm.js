'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:uploadFileForm
 * @description
 * # uploadFileForm
 */
angular.module('cosmoUiApp')
    .directive('uploadFileForm', function ($log) {
        return {
            templateUrl: 'views/directives/uploadFileForm.html',
            restrict: 'E',
            scope: {
                'extensions': '=',
                'inputPlaceholder': '@',
                'selection': '=',
                'readonlyInput': '='
            },
            link: function postLink(scope) {
                scope.onFileSelect = function ($files) {
                    $log.info('file was selected', $files);
                    if (_.isArray($files)) {
                        scope.selection = $files[0];
                    } else {
                        scope.selection = $files;
                    }
                    scope.inputText = scope.selection ? scope.selection.name : null;
                };

                scope.$watch('inputText', function(newValue){
                    if(!newValue) {
                        scope.selection = undefined;
                    } else if(scope.selection === undefined || (newValue !== scope.selection.name)){
                        scope.selection = newValue;
                    }
                });
            }
        };
    });
