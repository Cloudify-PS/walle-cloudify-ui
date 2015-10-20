'use strict';

angular.module('cosmoUiApp')
    .controller('UploadBlueprintDialogCtrl', function ($scope, $log, cloudifyClient, $q, $upload, ngProgress, CloudifyService, $filter) {

        var translate = $filter('translate');
        var selectedFile = null;
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';
        $scope.inputText = '';
        $scope.uploadType = 'file';
        $scope.uploadError = false;
        $scope.errorMessage = translate('blueprintUpload.generalError');
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
            ngProgress.reset();
            $scope.uploadDone($scope.blueprintUploadOpts.blueprint_id);
            $scope.closeThisDialog();
        }

        function onError(e) {
            // guy - todo - what the hell is going on here with the messages? we should try to uniform this
            // or at least document what/when
            var responseText = e && ( e.message || e.statusText || e.responseText || e );

            if (typeof(responseText) === 'string' && responseText.indexOf('Too Large') > 0) {
                responseText = translate('blueprintUpload.tooBig');
            }

            $scope.errorMessage = responseText;
            $scope.uploadError = true; // bad practice. single source of truth. todo: remove this
            $scope.uploadInProcess = false;
        }


        // handle upload without a file. upload with a url.
        $scope.publishArchive = function() {
            $scope.uploadInProcess = true;
            $scope.uploadError = false;

            var blueprint_path = $scope.inputText;
            var blueprint_id  = $scope.blueprintUploadOpts.blueprint_id;
            var blueprint_filename = $scope.blueprintUploadOpts.params.application_file_name;

            // the handlers expect the data, not the result, so lets strip away the result and return result.data
            cloudifyClient.blueprints.publish_archive(blueprint_path, blueprint_id, blueprint_filename)
                .then(function(result){
                    return result.data;
                },
                function( result ){
                    return $q.reject(result.data);
                })
                .then(onSuccess,onError);
        };


        $scope.uploadBlueprint = function () {

            $scope.uploadType = 'file';
            $scope.blueprintUploadOpts.blueprint_id = encodeURIComponent($scope.blueprintUploadOpts.blueprint_id);

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
