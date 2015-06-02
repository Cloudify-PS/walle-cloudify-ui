'use strict';

describe('Controller: FileSelectionDialogCtrl', function () {

    var FileSelectionDialogCtrl, _cloudifyService, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
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
            expect(scope.errorMessage).toBe('Error uploading blueprint'); // todo: verify with erez
        });

        it('should pass blueprint name to the blueprint add method', function() {
            scope.selectedFile = {};
            spyOn(scope, 'isUploadEnabled').andCallFake(function(){
                return true;
            });
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
            expected.append('type', 'file');

            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();

            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                var formData = _cloudifyService.blueprints.add.mostRecentCall.args[0];

                expect(JSON.stringify(formData)).toBe(JSON.stringify(expected));
            });
        });

        it('should not validate blueprint name', function() {
            scope.blueprintName = '~~~!!!@@@';
            scope.selectedFile = {};
            // expected to be on scope from parent.. todo: turn to directive. bind event callback.

            scope.uploadDone = function() {
                scope.uploadInProcess = false;
            };

            spyOn(scope, 'isUploadEnabled').andCallFake(function(){
                return true;
            });
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

        it('should update upload type to file when file is browsed', function () {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'url';
            scope.onFileSelect('somefile.tar.gz');
            expect(scope.uploadType).toBe('file');

        });

        it('should update upload type to url when url is entered', function () {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'file';
            spyOn(scope, 'isUploadEnabled').andCallFake(function(){
                return true;
            });
            scope.uploadFile();
            expect(scope.uploadType).toBe('url');

        });

        it('should get a blueprint archive file from a url', function() {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'url';
            scope.blueprintName = 'foo';
            var formDataUrl = null;
            scope.uploadDone = function() {
                scope.uploadInProcess = false;
            };
            _cloudifyService.blueprints.add = function(data, successCallback) {
                successCallback();
            };
            FormData.prototype.append = function(name, data) {
                formDataUrl = data;
                this.url = data;
            };
            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();
            spyOn(scope, 'isUploadEnabled').andCallFake(function(){
                return true;
            });

            scope.uploadFile();

            waitsFor(function() {
                return scope.uploadInProcess === false;
            });
            runs(function() {
                var formData = _cloudifyService.blueprints.add.mostRecentCall.args[0];
                expect(formData.url).toBe('http://some.kind/of/url.tar.gz');
            });
        });

        it('should reset the dialog variables on dialog close (CFY-2583)', function() {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.selectedFile = {data: 'fake data'};
            scope.blueprintUploadOpts = {
                blueprint_id: 'blueprint1',
                params: {
                    application_file_name: 'filename1'
                }
            };
            scope.toggleAddDialog = function() {};

            scope.closeDialog();

            expect(scope.inputText).toBe('');
            expect(scope.selectedFile).toBe('');
            expect(JSON.stringify(scope.blueprintUploadOpts)).toBe(JSON.stringify({
                blueprint_id: '',
                params: {
                    application_file_name: ''
                }
            }));
        });
    });
});
