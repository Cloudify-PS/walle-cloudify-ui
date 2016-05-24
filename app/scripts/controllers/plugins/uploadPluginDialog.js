'use strict';

angular.module('cosmoUiApp')
    .controller('UploadPluginDialogCtrl', function($scope, $log, cloudifyClient) {
        $scope.selectedFile = '';
        $scope.inputText = '';
        $scope.errorMessage = null;
        $scope.inProgress = false;

        $scope.upload = upload;
        $scope.onSuccess = onSuccess;
        $scope.onError = onError;
        $scope.onFileSelect = onFileSelect;
        $scope.isUploadEnabled = isUploadEnabled;

        $scope.$watch('myFile', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $scope.onFileSelect(newValue);
            }
        });
        $scope.$watch('inputText', function() {
            $scope.errorMessage = null;
        });

        /**
         * @description Takes either an archive ($scope.selectedFile) or a URL ($scope.inputText) and uploads it
         */
        function upload() {
            var path;

            if (!$scope.isUploadEnabled()) { return; }

            if (/https?:\/\//.test($scope.inputText)) {
                path = $scope.inputText;
            } else {
                path = $scope.selectedFile;
            }
            $log.info(['upload: ', path]);
            $scope.inProgress = true;
            cloudifyClient.plugins.upload(path).then($scope.onSuccess, $scope.onError);
        }

        function onSuccess() {
            $scope.inProgress = false;
            $scope.confirm();
        }

        function onError(response) {
            var error = 'dialogs.upload.defaultError';

            if (response) {
                if (/too large/i.test(response.statusText)) {
                    error = 'dialogs.upload.tooBig';
                } else if (response.data && response.data.message) {
                    error = response.data.message;
                }
            }
            $scope.errorMessage = error;
            $scope.inProgress = false;
        }

        function onFileSelect($files) {
            if (_.isArray($files)) {
                $scope.selectedFile = $files[0];
            } else {
                $scope.selectedFile = $files;
            }
            $scope.inputText = $scope.selectedFile ? $scope.selectedFile.name : null;
        }

        function isUploadEnabled() {
            return $scope.uploadForm.$valid && !$scope.inProgress;
        }
    });
