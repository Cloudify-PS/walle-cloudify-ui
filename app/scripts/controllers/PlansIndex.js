'use strict';

angular.module('cosmoUi')
    .controller('PlansIndexCtrl', function ($scope, $location, RestService) {
        $scope.isAddDialogVisible = false;
        $scope.selectedPlanId = null;



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

        $scope.loadBlueprints();

    });
