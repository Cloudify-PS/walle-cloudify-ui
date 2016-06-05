'use strict';

describe('Controller: SnapshotsCtrl', function() {

    var SnapshotsCtrl, scope;
    var _SnapshotsService;
    var _cloudifyClient;
    var _ngDialog;
    var _toaster;
    var snapshots = [{
        'status': 'created',
        'created_at': '2016-05-31 11:16:50.074876',
        'id': 'snap1',
        'error': ''
    }, {
        'status': 'failed',
        'created_at': '2016-05-30 15:11:20.946284',
        'id': 'snap2',
        'error': 'Oops, an error'
    }];

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    beforeEach(inject(function($controller, $rootScope, $q, SnapshotsService, cloudifyClient, ngDialog, toaster) {
        scope = $rootScope.$new();
        _SnapshotsService = SnapshotsService;
        _cloudifyClient = cloudifyClient;
        _ngDialog = ngDialog;
        _toaster = toaster;

        spyOn(_SnapshotsService, 'getSnapshots').and.returnValue({
            then: function(success) {
                success({data: {items: snapshots}});
                return $q.defer().promise;
            }
        });

        SnapshotsCtrl = $controller('SnapshotsCtrl', {$scope: scope});

        spyOn(scope, 'loadSnapshots').and.callThrough();
        spyOn(scope, 'togglePolling').and.stub();
        spyOn(_toaster, 'error').and.stub();
    }));

    describe('Init', function() {
        it('should create a controller', function() {
            expect(SnapshotsCtrl).toBeDefined();
        });
    });

    describe('#loadSnapshots', function() {
        it('should load snapshots list', function() {
            scope.loadSnapshots();
            expect(_SnapshotsService.getSnapshots).toHaveBeenCalled();
            expect(scope.snapshots.length).toBe(snapshots.length);
            expect(scope.togglePolling).toHaveBeenCalled();
        });
    });

    describe('#createSnapshot', function() {
        it('should reload snapshots after creation', function() {
            spyOn(_SnapshotsService, 'create').and.returnValue(window.mockPromise('created'));
            scope.createSnapshot();
            expect(_SnapshotsService.create).toHaveBeenCalled();
            expect(scope.loadSnapshots).toHaveBeenCalled();
            expect(_toaster.error).not.toHaveBeenCalled();
        });
        it('should handle errors occurred while creating a snapshot', function() {
            spyOn(_SnapshotsService, 'create').and.returnValue(
                window.mockPromise(null, {
                    statusText: 'Error',
                    data: {
                        message: 'Meh, an error occurred'}})
            );
            scope.createSnapshot();
            expect(_SnapshotsService.create).toHaveBeenCalled();
            expect(scope.loadSnapshots).not.toHaveBeenCalled();
            expect(_toaster.error).toHaveBeenCalledWith('Error', 'Meh, an error occurred');
        });
    });

    describe('#uploadSnapshot', function() {
        it('should reload snapshots after upload', function() {
            spyOn(_SnapshotsService, 'upload').and.returnValue(window.mockPromise('uploaded'));
            scope.uploadSnapshot();
            expect(_SnapshotsService.upload).toHaveBeenCalled();
            expect(scope.loadSnapshots).toHaveBeenCalled();
        });
    });

    describe('#togglePolling', function() {
        it('should switch polling on when any of snapshots is in progress', function() {
            snapshots[0].status = 'creating';
            scope.loadSnapshots();

            expect(scope.togglePolling).toHaveBeenCalledWith(true);
        });
        it('should switch polling off when none of snapshots is in progress', function() {
            snapshots[0].status = 'created';
            scope.loadSnapshots();

            expect(scope.togglePolling).toHaveBeenCalledWith(false);
        });
    });
});
