'use strict';

angular.module('cosmoUiApp')
    .controller('UploadSnapshotDialogCtrl', function($scope, $log, cloudifyClient) {
        $scope.upload = upload;
        $scope.onSuccess = onSuccess;
        $scope.onError = onError;
        $scope.onFileSelect = onFileSelect;

        $scope.errorMessage = null;
        $scope.inProgress = false;

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

            if (/https?:\/\//.test($scope.inputText)) {
                path = $scope.inputText;
            } else {
                path = $scope.selectedFile;
            }
            $log.info(['upload: ', path]);
            $scope.inProgress = true;
            cloudifyClient.snapshots.upload($scope.snapshotId, path)
                .then($scope.onSuccess, $scope.onError);
        }

        function onSuccess() {
            $scope.inProgress = false;
            $scope.confirm();
        }

        function onError(response) {
            var error = 'snapshots.dialogs.upload.defaultError';

            if (response) {
                if (/too large/i.test(response.statusText)) {
                    error = 'snapshots.dialogs.upload.tooBig';
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
    });
