'use strict';

angular.module('cosmoUiApp')
    .factory('SnapshotsService', function(cloudifyClient, $window, $q, ngDialog) {
        var SnapshotsService = {};

        SnapshotsService.getSnapshots = getSnapshots;
        SnapshotsService.restoreSnapshot = restoreSnapshot;
        SnapshotsService.downloadSnapshot = downloadSnapshot;
        SnapshotsService.deleteSnapshot = deleteSnapshot;
        SnapshotsService.upload = upload;
        SnapshotsService.create = create;

        SnapshotsService.actions = {
            restore: {
                name: 'restore',
                task: restoreSnapshot
            },
            download: {
                name: 'download',
                task: downloadSnapshot
            },
            delete: {
                name: 'delete',
                task: deleteSnapshot
            }
        };

        return SnapshotsService;

        /**
         * Opens Upload Snapshot dialog which has it's own upload logic
         * @returns {Promise}
         */
        function getSnapshots() {
            return cloudifyClient.snapshots.list();
        }

        /**
         * Opens Upload Snapshot dialog which has it's own upload logic
         * @returns {Promise}
         */
        function restoreSnapshot(snapshot, force, recreate_deployments_envs) {
            return cloudifyClient.snapshots.restore(snapshot.id, force, recreate_deployments_envs);
        }

        /**
         * Makes a rest api call to get snapshot archive file and opens a window to save the file
         * @param snapshot
         * @returns {Promise}
         */
        function downloadSnapshot(snapshot) {
            return cloudifyClient.snapshots.download(snapshot.id)
                .then(function(response) {
                    $window.open(response.config.url, '_self');
                });
        }

        /**
         * Opens delete snapshot dialog, if confirmed makes a rest api call to delete the snapshot
         * @param snapshot
         * @returns {Promise}
         */
        function deleteSnapshot(snapshot) {
            ngDialog.closeAll();
            return ngDialog
                .openConfirm({
                    template: 'views/snapshots/deleteDialog.html',
                    className: 'delete-snapshot-dialog',
                    data: snapshot
                })
                .then(function() {
                    return cloudifyClient.snapshots.delete(snapshot.id);
                });
        }

        /**
         * Opens Upload Snapshot dialog which has it's own upload logic
         * @returns {Promise}
         */
        function upload() {
            ngDialog.closeAll();
            return ngDialog
                .openConfirm({
                    template: 'views/snapshots/uploadDialog.html',
                    controller: 'UploadSnapshotDialogCtrl',
                    className: 'upload-snapshot-dialog'
                });
        }

        /**
         * Opens Upload Snapshot dialog which has it's own upload logic
         * @returns {Promise}
         */
        function create() {
            ngDialog.closeAll();
            return ngDialog
                .openConfirm({
                    template: 'views/snapshots/createDialog.html',
                    className: 'create-snapshot-dialog'
                })
                .then(function(id) {
                    return cloudifyClient.snapshots.create(id);
                });
        }
    });
