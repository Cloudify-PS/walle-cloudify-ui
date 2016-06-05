'use strict';

/**
 * @ngdoc function
 * @name cloudifyUiApp.controller:SnapshotsCtrl
 * @description
 * # SnapshotsCtrl
 * Controller of the cloudifyUiApp
 */
angular.module('cosmoUiApp')
    .controller('SnapshotsCtrl', function($scope, ngDialog, SnapshotsService, toaster) {
        $scope.loadSnapshots = loadSnapshots;
        $scope.createSnapshot = createSnapshot;
        $scope.uploadSnapshot = uploadSnapshot;
        $scope.togglePolling = togglePolling;

        $scope.errorMessage = '';
        $scope.itemsByPage = 9;
        SnapshotsService.actions.delete.success = $scope.loadSnapshots;
        SnapshotsService.actions.restore.success = $scope.loadSnapshots;
        $scope.actions = SnapshotsService.actions;

        $scope.loadSnapshots();

        function loadSnapshots() {
            SnapshotsService.getSnapshots()
                .then(function(response) {
                    $scope.snapshots = response.data.items;
                    $scope.togglePolling(
                        !!$scope.snapshots
                            .filter(function(snapshot) { return /creating|uploading|deleting|restoring/i.test(snapshot.status); })
                            .length
                    );
                }, function(response) {
                    $scope.errorMessage = response.status === 403 ? 'permissionError' : 'connectError';
                });
        }

        function createSnapshot() {
            SnapshotsService.create()
                .then($scope.loadSnapshots, function(response) {
                    if (response && response.statusText) {
                        toaster.error(response.statusText, response.data.message);
                    }
                });
        }

        function uploadSnapshot() {
            SnapshotsService.upload()
                .then($scope.loadSnapshots);
        }

        function togglePolling(on) {
            if (on) {
                $scope.registerTickerTask('snapshots/inProgress', loadSnapshots, 5000);
            } else {
                $scope.unregisterTickerTask('snapshots/inProgress');
            }
        }
    });
