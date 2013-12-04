'use strict';

angular.module('cosmoUi')
    .directive('addPlan', function () {
        return {
            template: '<div id="addDialogBg"></div>' +
                '<div id="addPlanContainer">' +
                    '<div id="addPlanClose" class="formButton" ng-click="closeDialog()">X</div>' +
                    '<div id="addPlanTitle">Add a Plan</div>' +
                    '<div id="addPlanDescription">Some text that explains about adding a plan by using this dialog</div>' +
                    '<form id="uploadForm" name="uploadForm">' +
                        '<div id="browse">' +
                            '<div id="browseBtn" class="formButton">Browse</div>' +
                            '<input type="text" id="browseTxt">' +
                            '<input type="file" name="fileInput" id="fileInput" accept=".tar,.gz,.yaml" ng-file-select="onFileSelect($files)">' +
                        '</div> ' +
                        '<div id="mainFile">YAML name: <input type="text" id="mainYamlName" ng-model="mainFileName"></div>' +
                        '<button id="uploadBtn" class="formButton" ng-class="{disabled: !isUploadEnabled(), enabled: isUploadEnabled()}" ng-click="uploadFile()">Upload</button>' +
                    '</form>' +
                '</div>',
            restrict: 'A',
            link: function postLink(scope, element) {
                var selectedFile = null;
                scope.mainFileName = '';
                scope.uploadEnabled = false;
                scope.uploadInProcess = false;

                scope.onFileSelect = function ($files) {
                    selectedFile = $files[0];
                    element.find('#browseTxt').val(selectedFile.name);
                    console.log(['files were selected', $files]);
                };

                scope.uploadFile = function() {
                    scope.mainFileName = element.find('#mainYamlName').val();
                    console.log(['upload: ', selectedFile]);

                    if (!scope.isUploadEnabled()) {
                        return;
                    }

                    var planForm = new FormData();
                    planForm.append('application_file', scope.mainFileName);
                    planForm.append('application_archive', selectedFile);
                    scope.uploadInProcess = true;

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
                            scope.uploadInProcess = false;
                            scope.loadBlueprints();
                            scope.closeDialog();
                        },
                        error: function() {
                            scope.uploadInProcess = false;
                        }
                    });
                };

                scope.closeDialog = function() {
                    scope.toggleAddDialog();
                };

                scope.isUploadEnabled = function() {
                    return (selectedFile !== null && scope.mainFileName !== undefined && scope.mainFileName.length > 0 && !scope.uploadInProcess);
                };
            }
        };
    });