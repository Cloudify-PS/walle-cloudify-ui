'use strict';

describe('Controller: UploadPluginDialogCtrl', function() {

    var UploadPluginDialogCtrl, _cloudifyClient, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, cloudifyClient) {
        _cloudifyClient = cloudifyClient;

        scope = $rootScope.$new();
        scope.confirm = jasmine.createSpy();
        scope.uploadForm = {$valid: false};

        UploadPluginDialogCtrl = $controller('UploadPluginDialogCtrl', {
            $scope: scope
        });
    }));


    describe('Controller tests', function() {
        it('should create a controller', function() {
            expect(UploadPluginDialogCtrl).not.toBeUndefined();
        });
    });

    describe('$scope.$watch myFile', function() {
        it('should trigger a watch on myFile', function() {
            spyOn(scope, 'onFileSelect').and.callThrough();

            scope.$digest();
            scope.myFile = {name: 'foo'};
            scope.$digest();

            expect(scope.onFileSelect).toHaveBeenCalledWith({name: 'foo'});
            expect(scope.inputText).toBe('foo');
        });
    });

    describe('$scope.$watch inputText', function() {
        it('should remove error message on inputText change', function() {
            scope.errorMessage = 'error';
            scope.inputText = 'foo';
            scope.$digest();

            expect(scope.errorMessage).toBe(null);
        });
    });

    describe('#onFileSelect', function() {
        it('should support both array and single items', function() {
            scope.onFileSelect('foo');
            expect(scope.selectedFile).toBe('foo');

            scope.onFileSelect(['bar']);
            expect(scope.selectedFile).toBe('bar');
        });
    });

    describe('#upload', function() {
        beforeEach(function() {
            spyOn(_cloudifyClient.plugins, 'upload').and.returnValue({
                then: function(success) {
                    return success();
                }
            });
            spyOn(scope, 'isUploadEnabled').and.returnValue(true);
            spyOn(scope, 'onSuccess').and.callThrough();
        });

        it('should upload plugin via URL', function() {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.upload();

            expect(scope.onSuccess).toHaveBeenCalled();
            expect(_cloudifyClient.plugins.upload).toHaveBeenCalledWith('http://some.kind/of/url.tar.gz');
        });

        it('should upload plugin as a file', function() {
            scope.selectedFile = {my: 'file'};
            scope.upload();

            expect(scope.onSuccess).toHaveBeenCalled();
            expect(_cloudifyClient.plugins.upload).toHaveBeenCalledWith({my: 'file'});
        });
    });

    describe('#onSuccess', function() {
        it('should put id on scope.pluginUploadOpts.plugin_id ', function() {
            scope.inProgress = true;
            scope.onSuccess();

            expect(scope.confirm).toHaveBeenCalled();
            expect(scope.inProgress).toBe(false);
        });
    });

    describe('#onError', function() {
        it('should show an error message when error comes from backend', function() {
            spyOn(_cloudifyClient.plugins, 'upload').and.returnValue({
                then: function(success, error) {
                    return error({data: {message: 'error'}});
                }
            });
            spyOn(scope, 'isUploadEnabled').and.returnValue(true);
            spyOn(scope, 'onError').and.callThrough();

            scope.upload();

            expect(scope.onError).toHaveBeenCalledWith({data: {message: 'error'}});
            expect(scope.inProgress).toBe(false);
            expect(scope.errorMessage).toBe('error');
        });

        it('shoud show a user-friendly message if a file is too big', function() {
            scope.inProgress = true;
            scope.onError({statusText: 'Payload Too Large'});

            expect(scope.inProgress).toBe(false);
            expect(scope.errorMessage).toBe('dialogs.upload.tooBig');
        });
    });

    describe('validation', function() {
        it('should accept multiple file compressions', inject(function($templateCache) {
            var html = $templateCache.get('views/plugins/uploadPluginDialog.html');

            expect(/.tar.bz2, .bz2, .gz, .tar.gz, .tar, .tgz, .zip, .wgn/.test(html)).toBe(true);
        }));
    });
});
