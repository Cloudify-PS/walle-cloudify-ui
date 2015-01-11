'use strict';

angular.module('cosmoUiApp')
    .controller('FileSelectionDialogCtrl', function ($scope, $log, CloudifyService) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.blueprintName = '';
        $scope.blueprintFilename = '';
        $scope.uploadError = false;
        $scope.errorMessage = 'Error uploading blueprint';
        $scope.blueprintUploadOpts = {
            blueprint_id: '',
            params: {
                application_file_name: ''
            }
        };

        $scope.onFileSelect = function ($files) {
            $scope.selectedFile = $files[0];
            $log.info(['files were selected', $files]);
        };

        $scope.$watch('blueprintUploadOpts.params.application_file_name', function(filename) {
            $scope.blueprintUploadOpts.params = {};

            if (filename) {
                $scope.blueprintUploadOpts.params = {
                    application_file_name: filename
                }
            }
        });

        $scope.uploadFile = function() {
            $log.info(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled()) {
                return;
            }
            var blueprintUploadForm = new FormData();
            blueprintUploadForm.append('application_archive', $scope.selectedFile);
            blueprintUploadForm.append('opts', JSON.stringify($scope.blueprintUploadOpts));

            $scope.uploadInProcess = true;
            $scope.uploadError = false;

            CloudifyService.blueprints.add(blueprintUploadForm,
                function(data) {
                    if ($scope.blueprintName === undefined || $scope.blueprintName === '') {
                        $scope.blueprintName = data.id;
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
                        responseText = e.responseJSON;
                    } catch (e) {}

                    if (responseText && responseText.hasOwnProperty('message')) {
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
