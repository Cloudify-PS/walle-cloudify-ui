'use strict';

describe('Service: SnapshotService', function() {
    var _SnapshotsService;
    var _cloudifyClient;
    var _$rootScope;
    var _ngDialog;
    var _window;
    var _$q;
    var snapshot = {id: 'snapshot1'};

    // load the service's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    beforeEach(inject(function(SnapshotsService, cloudifyClient, $rootScope, ngDialog, $window, $q) {
        _SnapshotsService = SnapshotsService;
        _cloudifyClient = cloudifyClient;
        _$rootScope = $rootScope;
        _ngDialog = ngDialog;
        _window = $window;
        _$q = $q;

        spyOn(_ngDialog, 'closeAll').and.stub();
        spyOn(_ngDialog, 'openConfirm').and.returnValue(window.mockPromise(snapshot.id));
    }));

    it('should exist and have its api', function() {
        expect(_SnapshotsService).toBeDefined();
        expect(typeof _SnapshotsService.getSnapshots).toBe('function');
        expect(typeof _SnapshotsService.restoreSnapshot).toBe('function');
        expect(typeof _SnapshotsService.downloadSnapshot).toBe('function');
        expect(typeof _SnapshotsService.deleteSnapshot).toBe('function');
        expect(typeof _SnapshotsService.upload).toBe('function');
        expect(typeof _SnapshotsService.create).toBe('function');
        expect(typeof _SnapshotsService.actions.restore.task).toBe('function');
        expect(typeof _SnapshotsService.actions.download.task).toBe('function');
        expect(typeof _SnapshotsService.actions.delete.task).toBe('function');
    });

    describe('#getSnapshots', function() {
        it('should get snapshots list', function() {
            spyOn(_cloudifyClient.snapshots, 'list').and.stub();
            _SnapshotsService.getSnapshots();
            expect(_cloudifyClient.snapshots.list).toHaveBeenCalled();
        });
    });

    describe('#restoreSnapshot', function() {
        it('should restore snapshot', function() {
            spyOn(_cloudifyClient.snapshots, 'restore').and.stub();
            _SnapshotsService.restoreSnapshot(snapshot, true, true);
            expect(_cloudifyClient.snapshots.restore).toHaveBeenCalledWith('snapshot1', true, true);
        });
    });

    describe('#downloadSnapshot', function() {
        it('should download snapshot', function() {
            spyOn(_cloudifyClient.snapshots, 'download').and.returnValue(
                window.mockPromise({
                    config: {
                        url: 'url/to/snapshot'
                    }
                })
            );
            spyOn(_window, 'open').and.stub();
            _SnapshotsService.downloadSnapshot(snapshot);
            expect(_cloudifyClient.snapshots.download).toHaveBeenCalledWith('snapshot1');
            expect(_window.open).toHaveBeenCalledWith('url/to/snapshot', '_self');
        });
    });

    describe('#deleteSnapshot', function() {
        it('should delete snapshot', function() {
            spyOn(_cloudifyClient.snapshots, 'delete').and.stub();
            _SnapshotsService.deleteSnapshot(snapshot);
            expect(_ngDialog.closeAll).toHaveBeenCalled();
            expect(_ngDialog.openConfirm).toHaveBeenCalledWith({
                template: 'views/snapshots/deleteDialog.html',
                className: 'delete-snapshot-dialog',
                data: snapshot
            });
            expect(_cloudifyClient.snapshots.delete).toHaveBeenCalledWith('snapshot1');
        });
    });

    describe('#upload', function() {
        it('should open Upload Snapshot dialog', function() {
            _SnapshotsService.upload();
            expect(_ngDialog.closeAll).toHaveBeenCalled();
            expect(_ngDialog.openConfirm).toHaveBeenCalledWith({
                template: 'views/snapshots/uploadDialog.html',
                controller: 'UploadSnapshotDialogCtrl',
                className: 'upload-snapshot-dialog'
            });
        });
    });

    describe('#create', function() {
        it('should create snapshot', function() {
            spyOn(_cloudifyClient.snapshots, 'create').and.stub();
            _SnapshotsService.create();
            expect(_ngDialog.closeAll).toHaveBeenCalled();
            expect(_ngDialog.openConfirm).toHaveBeenCalledWith({
                template: 'views/snapshots/createDialog.html',
                className: 'create-snapshot-dialog'
            });
            expect(_cloudifyClient.snapshots.create).toHaveBeenCalledWith('snapshot1');
        });
    });
});
