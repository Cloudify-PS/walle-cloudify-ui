'use strict';

angular.module('cosmoUi')
    .controller('DeploymentProgressPanelCtrl', function ($scope) {
        $scope.panelOpen = false;
        $scope.nodes = [
            {
                name: 'Node112233',
                inProgress: 5,
                ready: 0,
                failed: 0,
                status: 'in progress'
            },
            {
                name: 'Node112234',
                inProgress: 5,
                ready: 0,
                failed: 0,
                status: 'success'
            },
            {
                name: 'Node112235',
                inProgress: 5,
                ready: 0,
                failed: 0,
                status: 'failed'
            },
            {
                name: 'Node112236',
                inProgress: 5,
                ready: 0,
                failed: 0,
                status: 'N/A'
            }
        ];

        $scope.getWorkflow = function() {
            if ($scope.selectedWorkflow.data === null) {
                return 'All workflows'
            } else {
                return $scope.selectedWorkflow.data.label;
            }
        };

        $scope.togglePanel = function() {
            $scope.panelOpen = $scope.panelOpen === false;
        };
    });
