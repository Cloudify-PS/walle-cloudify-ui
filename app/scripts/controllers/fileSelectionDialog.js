'use strict';

angular.module('cosmoUiApp')
    .controller('FileSelectionDialogCtrl', function ($scope, $log, $upload, ngProgress) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.inputText = '';
        $scope.uploadType = 'file';
        $scope.blueprintName = '';
        $scope.uploadError = false;
        $scope.errorMessage = 'Error uploading blueprint';
        $scope.blueprintUploadOpts = {};

        $scope.onFileSelect = function ($files) {
            $log.info('file was selected', $files);
            if ( _.isArray($files) ) {
                $scope.selectedFile = $files[0];
            }else{
                $scope.selectedFile = $files;
            }

            $scope.archiveUrl = '';
            $scope.uploadType = 'file';
            $scope.inputText = $scope.selectedFile ? $scope.selectedFile.name : null;

            $log.info(['files were selected', $files]);
        };

        $scope.$watch('myFile', function(newValue, oldValue){
            if ( !!newValue && newValue !== oldValue ) {
                $scope.onFileSelect(newValue);
            }
        });

        $scope.$watch('blueprintUploadOpts.params.application_file_name', function(filename) {
            $scope.blueprintUploadOpts.params = {};

            if (filename) {
                $scope.blueprintUploadOpts.params = {
                    application_file_name: filename
                };
            }
        });

        $scope.$watch('uploadInProcess', function (newValue) {
            if (!!newValue) {
                ngProgress.reset();
            }
        });

        $scope.uploadFile = function() {
            $log.info(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled()) {
                return;
            }

            if ($scope.inputText.indexOf('http') > -1) {
                $scope.uploadType = 'url';
            } else {
                $scope.uploadType = 'file';
            }

            var uploadData = {
                url: '/backend/blueprints/upload',
                file: $scope.selectedFile,
                fileFormDataName: 'application_archive',
                fields: { opts : JSON.stringify($scope.blueprintUploadOpts) , type: $scope.uploadType, url : $scope.inputText }
            };

            $scope.uploadInProcess = true;

            $scope.uploadError = false;
            $upload.upload(uploadData).progress(function(evt){
                $log.debug('loaded ', evt.loaded, ' out of total', evt.total);
            }).success(function(data){
                if ($scope.blueprintName === undefined || $scope.blueprintName === '') {
                    $scope.blueprintName = data.id;
                }
                $scope.$apply(function() {
                    $scope.uploadError = false;
                    $scope.uploadDone($scope.blueprintName);
                });
                $scope.uploadDone($scope.blueprintName);
            }).error( function(e) {
                var responseText = e;

                if ( typeof(responseText) === 'string' && responseText.indexOf('Too Large')){
                    responseText = { 'message' : 'Blueprint is too big' };
                }

                if (responseText && responseText.hasOwnProperty('message')) {
                    $scope.errorMessage = responseText.message;
                } else if(e.hasOwnProperty('statusText')) {
                    $scope.errorMessage = e.statusText;
                }
                $scope.uploadError = true;
                $scope.uploadInProcess = false;
            }).progress(function(evt){
                try {
                    var percentage= Math.min(100,parseInt(100.0 * evt.loaded / evt.total,10)); //normalize;
                    $log.info('setting', percentage);
                    ngProgress.set(percentage);
                }catch(e){ $log.error(e); }
            });
        };

        $scope.closeDialog = function() {
            resetDialog();
            $scope.toggleAddDialog();
            $scope.uploadError = false;
        };

        $scope.isUploadEnabled = function() {
            return (($scope.inputText !== '' && $scope.inputText !== undefined) &&
                !$scope.uploadInProcess &&
                $scope.blueprintUploadOpts.blueprint_id !== undefined &&
                $scope.blueprintUploadOpts.blueprint_id.length > 0);
        };

        $scope.isUploadError = function() {
            return $scope.uploadError;
        };

        function resetDialog() {
            $scope.selectedFile = '';
            $scope.inputText = '';
            $scope.blueprintUploadOpts = {
                blueprint_id: '',
                params: {
                    application_file_name: ''
                }
            };
        }

        resetDialog();
    });
