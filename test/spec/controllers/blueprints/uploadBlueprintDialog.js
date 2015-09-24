'use strict';

describe('Controller: UploadBlueprintDialogCtrl', function () {

    var UploadBlueprintDialogCtrl, _cloudifyService, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {

        scope = $rootScope.$new();
        scope.closeThisDialog = jasmine.createSpy();
        _cloudifyService = CloudifyService;

        UploadBlueprintDialogCtrl = $controller('UploadBlueprintDialogCtrl', {
            $scope: scope,
            CloudifyService: _cloudifyService
        });
    }));


    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(UploadBlueprintDialogCtrl).not.toBeUndefined();
        });

        it('should show error message when error returns from backend', inject(function ( cloudifyClient ) {
            expect(scope.errorMessage).toBe('blueprintUpload.generalError'); // todo: verify with erez
            scope.selectedFile = {};
            scope.blueprintUploadOpts.blueprint_id = 'blueprint1';

            spyOn(cloudifyClient.blueprints, 'publish_archive').andCallFake(function () {

                return { // promise
                    then: function( ){
                        return {
                            then:function(success, error){
                                return error({ 'responseText' : 'foo2'});
                            }
                        };
                    }

                };

            });

            scope.publishArchive();
            expect(scope.errorMessage).toBe('foo2');
        }));

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

        // should update upload type to url when url is entered - is not relevant anymore now that we are using cloudifyfClient

        it('should invoke cloudifyClient.blueprints.publish_archive with the correct values', inject(function ( cloudifyClient ) {

            spyOn(cloudifyClient.blueprints, 'publish_archive').andCallFake(function () {
                    return {
                        then: function () {
                            return {
                                then: function () {
                                }
                            };
                        }
                    };
                }
            );

            scope.inputText = 'http://some.kind/of/url.tar.gz';
            _cloudifyService.blueprints.add = function (data, successCallback) {
                successCallback({id:'blueprint1'});
            };
            spyOn(_cloudifyService.blueprints, 'add').andCallThrough();
            spyOn(scope, 'isUploadEnabled').andCallFake(function () {
                return true;
            });

            scope.publishArchive();
            expect( cloudifyClient.blueprints.publish_archive ).toHaveBeenCalledWith('http://some.kind/of/url.tar.gz', '', '');
        }));
    });

    describe('#onUploadSuccess', function(){
        beforeEach(function(){
            scope.uploadDone = function(){}; // mock.
        });

        it('should put id on scope.blueprintUploadOpts.blueprint_id ', function(){
            UploadBlueprintDialogCtrl.onUploadSuccess({'id':'foo'});
            expect(scope.blueprintUploadOpts.blueprint_id).toBe('foo');
            expect(scope.closeThisDialog).toHaveBeenCalled();
        });
    });

    describe('#onUploadError', function(){


        it('should put error on scope while supporting 3 formats for error', function(){

            UploadBlueprintDialogCtrl.onUploadError('foo'); // format 1 - simple text
            expect(scope.errorMessage).toBe('foo');

            UploadBlueprintDialogCtrl.onUploadError({'message' : 'bar'}); // format 2 - object with message
            expect(scope.errorMessage).toBe('bar');

            UploadBlueprintDialogCtrl.onUploadError({'statusText' : 'foo'}); // format 2 - object with message
            expect(scope.errorMessage).toBe('foo');

        });

        it('should mark process is over', function(){
            scope.uploadInProcess = true;
            UploadBlueprintDialogCtrl.onUploadError('foo');
            expect(scope.uploadInProcess).toBe(false);
        });

        it('handle HTML response that file is too big, and present a nice message to user', function(){
            UploadBlueprintDialogCtrl.onUploadError('<html>Too Large</html>');
            expect(scope.errorMessage).toBe('blueprintUpload.tooBig');
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
