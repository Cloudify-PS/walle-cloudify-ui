'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $log, ngDialog, cloudifyClient, $q) {
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.managerError = false;
        $scope.itemToDelete = null;

        $scope.itemsByPage = 5;

        $scope.openAddDialog = function() {
            ngDialog.open({
                template: 'views/blueprint/uploadDialog.html',
                controller: 'UploadBlueprintDialogCtrl',
                scope: $scope,
                className: 'upload-dialog'
            });
        };


        $scope.loadBlueprints = function() {
            $scope.blueprints = null;
            $scope.managerError = false;
            var deferred = $q.defer();
            cloudifyClient.blueprints.list('id,updated_at,created_at').then(function (result) {

                if (result.data.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $log.info('done');
                    $scope.blueprints = _.sortByOrder(result.data, ['updated_at'], [false]);
                }
                deferred.resolve();
            }, function (result) {
                $scope.managerError = result.data || 'General Error';
                $log.error('got error result', result.data);
                deferred.reject();
            });
            return deferred.promise;
        };

        function loadDeployments(){

            _.map($scope.blueprints, function(b) {
                b.deploymentsCount = 0;
                return b;
            });

            cloudifyClient.deployments.list('blueprint_id').then(function( result ){
                _.each(result.data, function( dep ){
                    $log.info( dep );
                    var blueprint = _.find($scope.blueprints, function(b){
                        return b.id === dep.blueprint_id;
                    });
                    blueprint.deploymentsCount++;
                });
                $scope.deploymentsCount = true;
            }, function(/*result*/){
                // alert on error somewhere. todo.
            });
        }

        $scope.uploadDone = function(blueprint_id) {
            $location.path('/blueprint/' + blueprint_id + '/topology');
        };

        $scope.loadBlueprints().then(loadDeployments);
    });

