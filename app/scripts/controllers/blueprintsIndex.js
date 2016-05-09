'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $log, cloudifyClient, CloudifyService, HotkeysManager, $state, ItemSelection) {
        var blueprintsSelection;
        $scope.lastExecutedPlan = null;
        $scope.managerError = false;
        $scope.itemToDelete = null;
        $scope.itemsByPage = 9;

        function loadBlueprints() {
            $scope.blueprints = null;
            $scope.managerError = false;
            return cloudifyClient.blueprints.list('id,updated_at,created_at,description').then(function (result) {
                if (result.data.items.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $scope.blueprints = _.sortByOrder(result.data.items, ['updated_at'], [false]);
                }
            }, function (result) {
                $log.error('got error result', result.data);
                $scope.managerError = CloudifyService.getErrorMessage(result) || 'General Error';
            });
        }

        function loadDeployments() {
            cloudifyClient.deployments.list('blueprint_id').then(function (result) {
                var deploymentsPerBlueprint = _.groupBy(result.data.items, 'blueprint_id');
                _.each($scope.blueprints, function (b) {
                    b.deploymentsCount = deploymentsPerBlueprint.hasOwnProperty(b.id) ? deploymentsPerBlueprint[b.id].length : 0;
                });
                $scope.deploymentsCount = true;
            }, function (/*result*/) {
                // alert on error somewhere. todo.
            });
        }

        $scope.loadBlueprints = function () {
            loadBlueprints().then(loadDeployments);
        };

        $scope.loadBlueprints();

        $scope.select = function(blueprint){
            blueprintsSelection.select(blueprint);
        };

        $scope.$watch('displayedBlueprints', function(newValue){
            blueprintsSelection = new ItemSelection(newValue);
        });

        HotkeysManager.bindBlueprintActions($scope);
        HotkeysManager.bindItemsNavigation($scope, function(){
            blueprintsSelection.selectNext();
        }, function () {
            blueprintsSelection.selectPrevious();
        }, {
            description: 'Route to selected blueprint',
            callback: function(){
                if(blueprintsSelection.selected){
                    $state.go('cloudifyLayout.blueprintLayout.topology',{blueprintId: blueprintsSelection.selected.id});
                }
            }
        });
        HotkeysManager.bindQuickSearch($scope, function(){
            $scope.focusInput = true;
        });
        HotkeysManager.bindPaging($scope);
    });
