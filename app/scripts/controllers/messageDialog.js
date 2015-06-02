'use strict';

angular.module('cosmoUiApp')
    .controller('MessageDialogCtrl', function ($scope) {
        $scope.close = function() {
            $scope.closeDialog();
        }
    });
