'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, $log, ngDialog, cloudifyClient) {
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.managerError = false;
        $scope.itemToDelete = null;


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
            cloudifyClient.blueprints.list('id,updated_at,created_at').then(function (result) {

                if (result.data.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $scope.blueprints = _.sortByOrder(result.data, ['updated_at'], [false]);
                }
            }, function (result) {
                $scope.managerError = result.data || 'General Error';
                $log.error('got error result', result.data);
            });
        };

        // blueprintID to deployment count map
        var deploymentsCount = {};
        function loadDeployments(){
            cloudifyClient.deployments.list('blueprint_id').then(function( result ){
                _.each(result.data, function( dep ){
                    $log.info( dep );
                    if ( !deploymentsCount.hasOwnProperty(dep.blueprint_id)){
                        deploymentsCount[dep.blueprint_id] = 0;
                    }
                    deploymentsCount[dep.blueprint_id]++;
                });
            }, function(/*result*/){
                // alert on error somewhere. todo.
            });
        }

        $scope.countDeployments = function(blueprint){
            return deploymentsCount.hasOwnProperty(blueprint.id) ? deploymentsCount[blueprint.id] : 0;
        };

        $scope.uploadDone = function(blueprint_id) {
            $location.path('/blueprint/' + blueprint_id + '/topology');
        };

        $scope.loadBlueprints();
        loadDeployments();
    });
