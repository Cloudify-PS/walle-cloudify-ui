'use strict';

angular.module('cosmoUi')
    .controller('PopupCtrl', function ($scope) {
        var selectedFile = null;
        $scope.mainFileName = 'mezzanine_blueprint.yaml'; // just until cosmo team will resolve this issue.
        $scope.uploadEnabled = false;
        $scope.uploadInProcess = false;
        $scope.selectedFile = '';

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
            planForm.append('application_file_name', $scope.mainFileName);
            planForm.append('application_archive', $scope.selectedFile);
            $scope.uploadInProcess = true;

            $.ajax({
                url: '/backend/blueprints/add',
                data: planForm,
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                xhrFields: {
                    onprogress: function (e) {
                        if (e.lengthComputable) {
                            console.log('Loaded ' + (e.loaded / e.total * 100) + '%');
                        } else {
                            console.log('Length not computable.');
                        }
                    }
                },
                success: function() {
                    $scope.uploadInProcess = false;
                    $scope.loadBlueprints();
                    $scope.closeDialog();
                },
                error: function() {
                    $scope.uploadInProcess = false;
                }
            });
        };

        $scope.closeDialog = function() {
            $scope.toggleAddDialog();
        };

        $scope.isUploadEnabled = function() {
            return ($scope.selectedFile !== null && $scope.mainFileName !== undefined && $scope.mainFileName.length > 0 && !$scope.uploadInProcess);
        };
    });
