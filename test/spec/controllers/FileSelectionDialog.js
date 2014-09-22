'use strict';

describe('Controller: FileSelectionDialogCtrl', function () {

    var FileSelectionDialogCtrl, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            scope = $rootScope.$new();

            CloudifyService.addBlueprint = function(data, successCallback, errorCallback) {
                var e = {
                    "responseText": '{"status": 400  , "message": "400: Invalid blueprint name", "error_code": "Blueprint name required"}'
                };
                errorCallback(e);
            };

            FileSelectionDialogCtrl = $controller('FileSelectionDialogCtrl', {
                $scope: scope,
                CloudifyService: CloudifyService
            });
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(FileSelectionDialogCtrl).not.toBeUndefined();
        });

        it('should require a blueprint name', function() {
            scope.selectedFile = {};
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
