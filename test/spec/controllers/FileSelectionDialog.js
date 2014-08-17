'use strict';

describe('Controller: FileSelectionDialogCtrl', function () {

    var FileSelectionDialogCtrl, scope, fileData;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, RestService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            scope = $rootScope.$new();

            RestService.addBlueprint = function(data, successCallback, errorCallback) {
                $.ajax({
                    url: 'http://localhost:9001/backend/blueprints/add',    //'http://cosmo.gsdev.info/backend/blueprints/add'
                    data: data,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function(data) {
                        successCallback(data);
                    },
                    error: function(e) {
                        e.responseText = '{"status": 400, "message": "400: Invalid blueprint name", "error_code": "Blueprint name required"}';
                        errorCallback(e);
                    }
                });
            };

            fileData = {
                "fieldName": "application_archive",
                "originalFilename": "blueprint.tar.gz",
                "path": "./test/backend/resources/blueprint/blueprint.tar.gz",
                "headers": {
                    "content-disposition": "form-data; name='application_archive'; filename='blueprint.tar.gz'",
                    "content-type": "application/x-gzip"
                },
                "ws": {
                    "path": "~/Projects/cosmo-ui/test/backend/resources/blueprint/blueprint.tar.gz"
                },
                "size": 9141,
                "name": "blueprint.tar.gz",
                "type": "application/x-gzip"
            };

            FileSelectionDialogCtrl = $controller('FileSelectionDialogCtrl', {
                $scope: scope,
                RestService: RestService
            });
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(FileSelectionDialogCtrl).not.toBeUndefined();
        });

        it('should require a blueprint name', function() {
            scope.selectedFile = fileData;
            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadError === true;
            });

            runs(function() {
                expect(scope.errorMessage).toBe('400: Invalid blueprint name');
            });
        });
    });
});
