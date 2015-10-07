'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $log, ngDialog, cloudifyClient) {
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
            return cloudifyClient.blueprints.list('id,updated_at,created_at').then(function (result) {

                if (result.data.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $log.info('done');
                    $scope.blueprints = _.sortByOrder(result.data, ['updated_at'], [false]);
                }
            }, function (result) {
                $scope.managerError = result.data || 'General Error';
                $log.error('got error result', result.data);
            });
        };

        function loadDeployments(){

            cloudifyClient.deployments.list('blueprint_id').then(function( result ){
                console.log(result.data);
                var deploymentsPerBlueprint = _.groupBy( result.data, 'blueprint_id' );
                _.each($scope.blueprints, function(b){
                    b.deploymentsCount = deploymentsPerBlueprint.hasOwnProperty(b.id) ? deploymentsPerBlueprint[b.id].length : 0;
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

