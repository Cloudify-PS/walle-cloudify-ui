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

        it('should show error message when error returns from backend', function() {
            scope.selectedFile = {};
            scope.blueprintUploadOpts.blueprint_id = 'blueprint1';
            _cloudifyService.blueprints.add = function(data, successCallback, errorCallback) {
                var e = {
                    'responseText': 'Error uploading blueprint'   // todo: verify with erez
                };
                errorCallback(e);
            };

            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadError === true;
            });
            runs(function() {
                expect(scope.errorMessage).toBe('Error uploading blueprint'); // todo: verify with erez
            });
        });

        it('should pass blueprint name to the blueprint add method', function() {
            scope.selectedFile = {};
            scope.uploadDone = function() {
                scope.uploadInProcess = false;
            };
            _cloudifyService.blueprints.add = function(data, successCallback) {
                successCallback();
            };
            FormData.prototype.append = function(name, data) {
                this.name = data;
            };
            scope.blueprintName = 'blueprint1';
            scope.blueprintUploadOpts = {
                blueprint_id: 'blueprint1',
                params: {
                    application_file_name: 'filename1'
                }
            };

            var expected = new FormData();
            expected.append('application_archive', scope.selectedFile);
            expected.append('opts', '{"blueprint_id":"blueprint1","params":{"application_file_name":"filename1"}}');

            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();

            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                var formdata = _cloudifyService.blueprints.add.mostRecentCall.args[0];

                expect(JSON.stringify(formdata)).toBe(JSON.stringify(expected));
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

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                expect(scope.uploadDone).toHaveBeenCalledWith(scope.blueprintName);
            });
        });

        it('should reset the url when a file selected by browsing', function () {
            scope.archiveUrl = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'url';

            scope.onFileSelect('somefile.tar.gz');

            waitsFor(function() {
                return scope.uploadType === 'file';
            });
            runs(function() {
                expect(scope.archiveUrl).toBe('');
            });
        });

        it('should reset the selected file when a file selected by url', function () {
            scope.selectedFile = 'somefile.tar.gz';
            scope.uploadType = 'file';

            scope.archiveUrl = 'http://some.kind/of/url.tar.gz';

            waitsFor(function() {
                return scope.uploadType === 'url';
            });
            runs(function() {
                expect(scope.selectedFile).toBe('');
            });
        });

        it('should get a blueprint archive file from a url', function() {
            scope.archiveUrl = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'url';
            scope.uploadDone = function() {
                scope.uploadInProcess = false;
            };
            _cloudifyService.blueprints.add = function(data, successCallback) {
                successCallback();
            };
            FormData.prototype.append = function(name, data) {
                this.url = data;
            };
            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();

            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                var formData = _cloudifyService.blueprints.add.mostRecentCall.args[0];

                console.log(formData);
                expect(formData.url).toBe('http://some.kind/of/url.tar.gz');
            });
        });
    });
});
