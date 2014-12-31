'use strict';

describe('Controller: FileSelectionDialogCtrl', function () {

    var FileSelectionDialogCtrl, _cloudifyService, scope;

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
            _cloudifyService = CloudifyService;

            FileSelectionDialogCtrl = $controller('FileSelectionDialogCtrl', {
                $scope: scope,
                CloudifyService: _cloudifyService
            });
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(FileSelectionDialogCtrl).not.toBeUndefined();
        });

        it('should require a blueprint name', function() {
            scope.selectedFile = {};
            _cloudifyService.blueprints.add = function(data, successCallback, errorCallback) {
                var e = {
                    'responseText': 'Error uploading blueprint'   // todo: verify with erez
                };
                errorCallback(e);
            };

            scope.uploadFile();
            scope.$apply();

            waitsFor(function() {
                return scope.uploadError === true;
            });
            runs(function() {
                expect(scope.errorMessage).toBe('Error uploading blueprint'); // todo: verify with erez
            });
        });

        it('should not validate blueprint name', function() {
            scope.blueprintName = '~~~!!!@@@';
            scope.selectedFile = {};
            scope.uploadDone = function() {
                scope.uploadInProcess = false;
            };
            _cloudifyService.blueprints.add = function(data, successCallback) {
                successCallback();
            };
            spyOn(scope, 'uploadDone').andCallThrough();

            scope.uploadFile();
            scope.$apply();

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                expect(scope.uploadDone).toHaveBeenCalledWith(scope.blueprintName);
            });
        });
    });
});
