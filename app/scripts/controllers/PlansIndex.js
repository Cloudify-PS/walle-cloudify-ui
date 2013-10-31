'use strict';

angular.module('cosmoUi')
    .controller('PlansIndexCtrl', function ($scope, $location) {
        $scope.plans = [
            {
                'name': 'SugarCRM',
                'version': '2.0A',
                'description': 'A CRM Application',
                'directory': 'mezzanine-app',
                'file': 'mezzanine_blueprint.yaml'
            },
            {
                'name': 'AddressBook',
                'version': '1.0',
                'description': 'Company Contacts',
                'directory': 'mezzanine-app',
                'file': 'mezzanine_blueprint.yaml'
            },
            {
                'name': 'CandyCrunchAutoWinner',
                'version': '1.0',
                'description': 'Win The Best Game Ever Made',
                'directory': 'mezzanine-app',
                'file': 'mezzanine_blueprint.yaml'

            },
            {
                'name': 'Mezzanine',
                'version': '2.0',
                'directory': 'mezzanine-app',
                'file': 'mezzanine_blueprint.yaml',
                'description': 'Open Source CMS Powered By Django'
            }
        ];


        $scope.redirectTo = function (plan) {
            console.log(['redirecting to', plan]);
            $location.path('/plan').search({file: plan.file, directory: plan.directory, name: plan.name});
        };

    });
