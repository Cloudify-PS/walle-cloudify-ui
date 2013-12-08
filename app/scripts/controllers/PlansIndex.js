'use strict';

angular.module('cosmoUi')
    .controller('PlansIndexCtrl', function ($scope, $location, $cookieStore, RestService) {
        $scope.isAddDialogVisible = false;
        $scope.selectedPlanId = null;
        $scope.lastExecutedPlan = null;

        $scope.redirectTo = function (plan) {
            console.log(['redirecting to', plan]);
            $scope.selectedPlanId = plan.id;
            $location.path('/blueprint').search({id: plan.id, name: plan.name});
        };

        $scope.toggleAddDialog = function() {
            $scope.isAddDialogVisible = $scope.isAddDialogVisible === false;
        };

        $scope.loadBlueprints = function() {
            $scope.plans = RestService.loadBlueprints();
        };

        $scope.executePlan = function(plan) {
            $scope.lastExecutedPlan = RestService.executeBlueprint(plan.id);
        };

        $scope.$watch('lastExecutedPlan', function(data) {
            $cookieStore.put('lastExecutedPlan', data);
        });

        $scope.loadBlueprints();

    });
