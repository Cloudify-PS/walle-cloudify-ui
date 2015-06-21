'use strict';

angular.module('cosmoUiApp')
    .controller('FileSelectionDialogCtrl', function ($scope, $log, $upload, ngProgress, CloudifyService) {
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.inputText = '';
        $scope.uploadType = 'file';
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


        function onSuccess(data){

            if ($scope.blueprintUploadOpts.blueprint_id === undefined || $scope.blueprintUploadOpts.blueprint_id === '') {
                $scope.blueprintUploadOpts.blueprint_id = data.id;
            }
            $scope.uploadError = false;
            $scope.uploadDone($scope.blueprintUploadOpts.blueprint_id);
        }

        function onError(e) {
            // guy - todo - what the hell is going on here with the messages? we should try to uniform this
            // or at least document what/when

            var responseText = e && ( e.message || e.statusText || e );

            if (typeof(responseText) === 'string' && responseText.indexOf('Too Large') > 0) {
                responseText = 'Blueprint is too big';
            }

            $scope.errorMessage = responseText;
            $scope.uploadError = true; // bad practice. single source of truth. todo: remove this
            $scope.uploadInProcess = false;
        }


        $scope.publishArchive = function() {
            $scope.uploadType = 'url';

            var blueprintUploadForm = new FormData();

            $scope.blueprintUploadOpts.params.blueprint_archive_url = $scope.inputText;

            blueprintUploadForm.append('application_archive', $scope.selectedFile);
            blueprintUploadForm.append('opts', JSON.stringify($scope.blueprintUploadOpts));
            blueprintUploadForm.append('type', $scope.uploadType);

            $scope.uploadInProcess = true;
            $scope.uploadError = false;

            CloudifyService.blueprints.add(blueprintUploadForm,
                onSuccess,
                onError
                );
        };


        $scope.uploadBlueprint = function () {

            $scope.uploadType = 'file';

            var uploadData = {
                url: '/backend/blueprints/upload',
                file: $scope.selectedFile,
                fileFormDataName: 'application_archive',
                fields: {
                    opts: JSON.stringify($scope.blueprintUploadOpts),
                    type: $scope.uploadType,
                    url: $scope.inputText
                }
            };

            $scope.uploadInProcess = true;

            $scope.uploadError = false;
            $upload.upload(uploadData).progress(function (evt) {
                $log.debug('loaded ', evt.loaded, ' out of total', evt.total);
                try {
                    var percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10)); //normalize;
                    $log.info('setting', percentage);
                    ngProgress.set(percentage);
                } catch (e) {
                    $log.error(e);
                }
            }).success(onSuccess)
                .error(onError);
        };

        $scope.uploadFile = function() {
            $log.info(['upload: ', selectedFile]);

            if (!$scope.isUploadEnabled()) {
                return;
            }

            if ($scope.inputText.indexOf('http') > -1) {
                $scope.publishArchive();
            } else {
                $scope.uploadBlueprint();
            }
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


        // make it test friendly do not use these functions
        this.onUploadSuccess = onSuccess;
        this.onUploadError = onError;
    });
