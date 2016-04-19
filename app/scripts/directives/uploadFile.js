'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:uploadFile
 * @description
 * # uploadFile
 */

angular.module('cosmoUiApp')
    .directive('uploadFile', function () {
        return {
            templateUrl: 'views/directives/uploadFile.html',
            restrict: 'E',
            replace: true,
            bindToController: {
                openFileSelection: '='
            },
            controllerAs: 'uploadFileCtrl',
            scope:{
                onFileSelect: '&',
                extensions: '='
            },
            controller: function($element) {
                this.openFileSelection = function(){
                    $element[0].children[0].click();
                };
            }
        };
    });
