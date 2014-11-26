'use strict';

angular.module('cosmoUiApp')
    .controller('FileSelectionDialogCtrl', function ($scope, $log, CloudifyService) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.blueprintName = '';
        $scope.uploadError = false;
        $scope.errorMessage = 'Error uploading blueprint';

        $scope.onFileSelect = function ($files) {
            $scope.selectedFile = $files[0];
            $log.info(['files were selected', $files]);
        };

        $scope.uploadFile = function() {
            $log.info(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled()) {
                return;
            }

            var planForm = new FormData();
            planForm.append('application_archive', $scope.selectedFile);
            if ($scope.blueprintName !== '') {
                planForm.append('blueprint_id', $scope.blueprintName);
            }
            $scope.uploadInProcess = true;
            $scope.uploadError = false;

            CloudifyService.blueprints.add(planForm,
                function(data) {
                    if ($scope.blueprintName === undefined || $scope.blueprintName === '') {
                        $scope.blueprintName = JSON.parse(data).id;
                    }
                    $scope.$apply(function() {
                        $scope.uploadError = false;
                        $scope.uploadDone($scope.blueprintName);
                    });
                    $scope.uploadDone($scope.blueprintName);
                },
                function(e) {

                    var responseText = null;
                    try {
                        responseText = JSON.parse(e.responseText);
                    } catch (e) {}

                    if(responseText && responseText.hasOwnProperty('message')) {
                        $scope.errorMessage = responseText.message;
                    } else if(e.hasOwnProperty('statusText')) {
                        $scope.errorMessage = e.statusText;
                    }
                    $scope.$apply(function() {
                        $scope.uploadError = true;
                        $scope.uploadInProcess = false;
                    });
                });
        };

        $scope.closeDialog = function() {
            $scope.toggleAddDialog();
            $scope.uploadError = false;
        };

        $scope.isUploadEnabled = function() {
            return ($scope.selectedFile !== '' && !$scope.uploadInProcess);
        };

        $scope.isUploadError = function() {
            return $scope.uploadError;
        };
    });
