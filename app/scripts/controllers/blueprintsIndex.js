'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $log, ngDialog, cloudifyClient) {
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.managerError = false;
        $scope.itemToDelete = null;

        $scope.itemsByPage = 9;

        function loadBlueprints() {
            $scope.blueprints = null;
            $scope.managerError = false;
            return cloudifyClient.blueprints.list('id,updated_at,created_at,description').then(function (result) {

                if (result.data.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $scope.blueprints = _.sortByOrder(result.data, ['updated_at'], [false]);
                }
            }, function (result) {
                $scope.managerError = result.data || 'General Error';
                $log.error('got error result', result.data);
            });
        }

        function loadDeployments(){
            cloudifyClient.deployments.list('blueprint_id').then(function( result ){
                var deploymentsPerBlueprint = _.groupBy( result.data, 'blueprint_id' );
                _.each($scope.blueprints, function(b){
                    b.deploymentsCount = deploymentsPerBlueprint.hasOwnProperty(b.id) ? deploymentsPerBlueprint[b.id].length : 0;
                });
                $scope.deploymentsCount = true;
            }, function(/*result*/){
                // alert on error somewhere. todo.
            });
        }

        $scope.loadBlueprints = function(){
            loadBlueprints().then(loadDeployments);
        };

        $scope.loadBlueprints();
    });
