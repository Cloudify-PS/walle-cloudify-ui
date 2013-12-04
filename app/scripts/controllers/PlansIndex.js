'use strict';

angular.module('cosmoUi')
    .controller('PlansIndexCtrl', function ($scope, $location, RestService) {
        $scope.isAddDialogVisible = false;
        $scope.selectedPlanId;

//        $scope.plans = [
//            {
//                'name': 'SugarCRM',
//                'version': '2.0A',
//                'description': 'A CRM Application',
//                'directory': 'mezzanine-app',
//                'file': 'mezzanine_template.yaml'
//            },
//            {
//                'name': 'AddressBook',
//                'version': '1.0',
//                'description': 'Company Contacts',
//                'directory': 'mezzanine-app',
//                'file': 'mezzanine_template.yaml'
//            },
//            {
//                'name': 'CandyCrunchAutoWinner',
//                'version': '1.0',
//                'description': 'Win The Best Game Ever Made',
//                'directory': 'mezzanine-app',
//                'file': 'mezzanine_template.yaml'
//
//            },
//            {
//                'name': 'Mezzanine',
//                'version': '2.0',
//                'directory': 'mezzanine-app',
//                'file': 'mezzanine_template.yaml',
//                'description': 'Open Source CMS Powered By Django'
//            }
//        ];

        $scope.plans = RestService.loadBlueprints();

        $scope.redirectTo = function (plan) {
            console.log(['redirecting to', plan]);
            $scope.selectedPlanId = plan.id;
            $location.path('/plan').search({id: plan.id, name: plan.name});
        };

        $scope.toggleAddDialog = function() {
            $scope.isAddDialogVisible = $scope.isAddDialogVisible === false;
        };

    });
