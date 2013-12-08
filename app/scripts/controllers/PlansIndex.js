'use strict';

angular.module('cosmoUi')
    .controller('PlansIndexCtrl', function ($scope, $location, $cookieStore, RestService) {
        $scope.isAddDialogVisible = false;
        $scope.selectedPlanId = null;
        $scope.lastExecutedPlan = null;
        var _playingPlanId = $cookieStore.get('lastExecutedPlan');

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
//            $cookieStore.put('lastExecutedPlan', plan.id);
            $cookieStore.put('lastExecutedPlan', plan.name);
//            _playingPlanId = plan.id;
            _playingPlanId = plan.name;
        };

        $scope.isExecuting = function(planId) {
            return planId === _playingPlanId;
        };

        $scope.loadBlueprints();

    });
