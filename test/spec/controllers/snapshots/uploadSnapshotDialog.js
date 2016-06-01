'use strict';

describe('Controller: UploadSnapshotDialogCtrl', function() {

    var UploadSnapshotDialogCtrl, _cloudifyClient, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, cloudifyClient) {
        _cloudifyClient = cloudifyClient;

        scope = $rootScope.$new();
        scope.confirm = jasmine.createSpy();
        scope.uploadForm = {$valid: false};
        scope.snapshotId = 'snap1';

        UploadSnapshotDialogCtrl = $controller('UploadSnapshotDialogCtrl', {
            $scope: scope
        });
    }));


    describe('Controller tests', function() {
        it('should create a controller', function() {
            expect(UploadSnapshotDialogCtrl).toBeDefined();
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
            spyOn(_cloudifyClient.snapshots, 'upload').and.returnValue({
                then: function(success) {
                    return success();
                }
            });
            spyOn(scope, 'onSuccess').and.callThrough();
        });

        it('should upload snapshot via URL', function() {
            scope.inputText = 'http://some.kind/of/url.tar.gz';
            scope.upload();
            expect(scope.onSuccess).toHaveBeenCalled();
            expect(_cloudifyClient.snapshots.upload).toHaveBeenCalledWith('snap1', 'http://some.kind/of/url.tar.gz');
        });

        it('should upload snapshot as a file', function() {
            scope.selectedFile = {my: 'file'};
            scope.upload();
            expect(scope.onSuccess).toHaveBeenCalled();
            expect(_cloudifyClient.snapshots.upload).toHaveBeenCalledWith('snap1', {my: 'file'});
        });
    });

    describe('#onSuccess', function() {
        it('should put id on scope.snapshotUploadOpts.snapshot_id ', function() {
            scope.inProgress = true;
            scope.onSuccess();
            expect(scope.confirm).toHaveBeenCalled();
            expect(scope.inProgress).toBe(false);
        });
    });

    describe('#onError', function() {
        it('should show an error message when error comes from backend', function() {
            spyOn(_cloudifyClient.snapshots, 'upload').and.returnValue({
                then: function(success, error) {
                    return error({data: {message: 'error'}});
                }
            });
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
            expect(scope.errorMessage).toBe('snapshots.dialogs.upload.tooBig');
        });
    });
});
