'use strict';

angular.module('cosmoUi')
    .controller('FileSelectionDialogCtrl', function ($scope, $location) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.blueprintName = '';
        $scope.uploadError = false;
        $scope.errorMessage = 'Error uploading blueprint';

        $scope.onFileSelect = function ($files) {
            $scope.selectedFile = $files[0];
            console.log(['files were selected', $files]);
        };

        $scope.uploadFile = function() {
            console.log(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled() || !_validateBlueprintName($scope.blueprintName)) {
                return;
            }

            var planForm = new FormData();
            planForm.append('application_archive', $scope.selectedFile);
            if ($scope.blueprintName !== '') {
                planForm.append('blueprintId', $scope.blueprintName);
            }
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
                        $scope.uploadDone($scope.blueprintName);
                    });

                    $scope.uploadDone($scope.blueprintName);
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

        // Temporary solution - should be handled by Cosmo, not UI side
        function _validateBlueprintName(blueprintName) {
            if(/[^a-zA-Z0-9]/.test(blueprintName)) {
                $scope.errorMessage = 'Invalid blueprint name. Only Alphanumeric text allowed.';
                $scope.uploadError = true;
                $scope.uploadInProcess = false;

                return false;
            }
            return true;
        }
    });
