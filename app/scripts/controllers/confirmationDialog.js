'use strict';

angular.module('cosmoUi')
    .controller('ConfirmationDialogCtrl', function ($scope) {
        $scope.closeDialog = function() {
            $scope.toggleConfirmationDialog();
        };
    });
