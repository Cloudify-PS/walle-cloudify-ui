'use strict';

describe('Controller: FileSelectionDialogCtrl', function () {

    var FileSelectionDialogCtrl, _cloudifyService, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

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


    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(FileSelectionDialogCtrl).not.toBeUndefined();
        });

        it('should show error message when error returns from backend', function () {
            scope.selectedFile = {};
            scope.blueprintUploadOpts.blueprint_id = 'blueprint1';
            _cloudifyService.blueprints.add = function (data, successCallback, errorCallback) {
                var e = {
                    'responseText': 'Error uploading blueprint'   // todo: verify with erez
                };
                errorCallback(e);
            };

            scope.uploadFile();
            expect(scope.errorMessage).toBe('Error uploading blueprint'); // todo: verify with erez
        });

        describe('$scope.$watch myFile', function () {
            it('should trigger a watch on myFile', function () {
                spyOn(scope, 'onFileSelect').andCallFake(function () {
                });

                // trigger watch
                scope.$digest();
                scope.myFile = 'foo';
                scope.$digest();

                expect(scope.onFileSelect).toHaveBeenCalledWith('foo');
            });
        });


        describe('onFileSelect', function () {
            it('should support both array and single items', function () {
                scope.onFileSelect('foo');
                expect(scope.selectedFile).toBe('foo');

                scope.onFileSelect(['bar']);
                expect(scope.selectedFile).toBe('bar');
            });
        });

        it('should pass blueprint name to the $upload.upload', inject(function ( $upload ) {
            scope.selectedFile = {};

            spyOn(scope, 'isUploadEnabled').andCallFake(function () {
                return true;
            });

            scope.uploadDone = function () {
                scope.uploadInProcess = false;
            };

            spyOn($upload,'upload').andCallFake(function(){
                return {
                    progress: function(){
                        return {
                            success: function(callback){ callback( { id: 'foo' }); return { error: function(){}}; }
                        };
                    }
                };
            });
            _cloudifyService.blueprints.add = function (data, successCallback) {
                successCallback();
            };
            FormData.prototype.append = function (name, data) {
                this.name = data;
            };
            scope.blueprintUploadOpts = {
                blueprint_id: 'blueprint1',
                params: {
                    application_file_name: 'filename1'
                }
            };

            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();

            scope.uploadFile();

            var expected = {
                'url': '/backend/blueprints/upload',
                'file': {},
                'fileFormDataName': 'application_archive',
                'fields': {
                    'opts': '{"blueprint_id":"blueprint1","params":{"application_file_name":"filename1"}}',
                    'type': 'file',
                    'url': ''
                }
            };
            var formData = $upload.upload.mostRecentCall.args[0];
            expect(JSON.stringify(formData)).toBe(JSON.stringify(expected));
        }));


        it('should update upload type to file when file is browsed', function () {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'url';
            scope.onFileSelect('somefile.tar.gz');
            expect(scope.uploadType).toBe('file');

        });

        it('should update upload type to url when url is entered', function () {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadType = 'file';
            spyOn(scope, 'isUploadEnabled').andCallFake(function () {
                return true;
            });
            scope.uploadFile();
            expect(scope.uploadType).toBe('url');

        });

        it('should get a blueprint archive file from a url', function () {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.uploadDone = function () {
                scope.uploadInProcess = false;
            };
            _cloudifyService.blueprints.add = function (data, successCallback) {
                successCallback({id:'blueprint1'});
            };
            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();
            spyOn(scope, 'isUploadEnabled').andCallFake(function () {
                return true;
            });

            scope.publishArchive();

            expect(scope.uploadInProcess).toBe(false);
            expect(scope.blueprintUploadOpts.params.blueprint_archive_url).toBe('http://some.kind/of/url.tar.gz');
        });
    });

    describe('#onUploadSuccess', function(){
        beforeEach(function(){
            scope.uploadDone = function(){}; // mock.
        });
        it('should put id on scope.blueprintUploadOpts.blueprint_id ', function(){
            FileSelectionDialogCtrl.onUploadSuccess({'id':'foo'});
            expect(scope.blueprintUploadOpts.blueprint_id).toBe('foo');
        });
    });

    describe('#onUploadError', function(){


        it('should put error on scope while supporting 3 formats for error', function(){

            FileSelectionDialogCtrl.onUploadError('foo'); // format 1 - simple text
            expect(scope.errorMessage).toBe('foo');

            FileSelectionDialogCtrl.onUploadError({'message' : 'bar'}); // format 2 - object with message
            expect(scope.errorMessage).toBe('bar');

            FileSelectionDialogCtrl.onUploadError({'statusText' : 'foo'}); // format 2 - object with message
            expect(scope.errorMessage).toBe('foo');

        });

        it('should mark process is over', function(){
            scope.uploadInProcess = true;
            FileSelectionDialogCtrl.onUploadError('foo');
            expect(scope.uploadInProcess).toBe(false);
        });

        it('handle HTML response that file is too big, and present a nice message to user', function(){
            FileSelectionDialogCtrl.onUploadError('<html>Too Large</html>');
            expect(scope.errorMessage).toBe('Blueprint is too big');
        });

    });

    describe('#uploadBlueprint', function(){
        it('should update ngProgress with progress percentage', inject(function( $upload , ngProgress ){
            var progressCallback = null;

            spyOn($upload, 'upload').andCallFake(function () {
                return {
                    progress: function (callback) {
                        progressCallback = callback;
                        return {
                            success: function () {
                                return {
                                    error: function () {
                                    }
                                };
                            }
                        };
                    }
                };
            });


            var lastProgress = null;
            spyOn(ngProgress,'set').andCallFake(function( progress ){
                lastProgress = progress;
            });

            scope.uploadBlueprint();
            expect(progressCallback).not.toBe(null);

            progressCallback({ loaded : 20, total: 100});
            expect(lastProgress).toBe(20);

        }));

        it('should escape the blueprint id before upload (CFY-1958)', inject(function( $upload ) {
            scope.blueprintUploadOpts = {
                blueprint_id: 'a/b',
                params: {
                    application_file_name: 'filename1'
                }
            };

            spyOn($upload,'upload').andCallThrough();

            scope.uploadBlueprint();

            var opts = JSON.parse($upload.upload.mostRecentCall.args[0].fields.opts);
            expect(opts.blueprint_id).toBe('a%2Fb');
        }));
    });
});
