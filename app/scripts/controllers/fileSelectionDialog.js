'use strict';

angular.module('cosmoUi')
    .controller('FileSelectionDialogCtrl', function ($scope) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.uploadError = false;
        $scope.errorMessage = 'Error uploading blueprint';

        $scope.onFileSelect = function ($files) {
            $scope.selectedFile = $files[0];
            console.log(['files were selected', $files]);
        };

        $scope.uploadFile = function() {
            console.log(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled()) {
                return;
            }

            var planForm = new FormData();
            planForm.append('application_archive', $scope.selectedFile);
            $scope.uploadInProcess = true;
            $scope.uploadError = false;

            $.ajax({
                url: '/backend/blueprints/add',
                data: planForm,
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                success: function() {
                    $scope.$apply(function() {
                        $scope.uploadError = false;
                        $scope.uploadInProcess = false;
                    });
                    $scope.loadBlueprints();
                    $scope.closeDialog();
                },
                error: function(e) {
                    $scope.errorMessage = JSON.parse(e.responseText).message;
                    $scope.$apply(function() {
                        $scope.uploadError = true;
                        $scope.uploadInProcess = false;
                    });
                }
            });
        };

        $scope.closeDialog = function() {
            $scope.toggleAddDialog();
        };

        $scope.isUploadEnabled = function() {
            return ($scope.selectedFile !== '' && !$scope.uploadInProcess);
        };

        $scope.isUploadError = function() {
            return $scope.uploadError;
        };
    });
