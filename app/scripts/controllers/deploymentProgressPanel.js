'use strict';

angular.module('cosmoUi')
    .controller('DeploymentProgressPanelCtrl', function ($scope) {
        $scope.panelOpen = false;
        $scope.panelNodes = {
            inProgress: {count: 0, nodes: []},
            ready: {count: 0, nodes: []},
            failed: {count: 0, nodes: []}
        };

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

        $scope.getNodesCount = function(node, state) {
            var count = 0;
            var item = $scope.panelNodes[state].nodes[node.id];

            if (item !== undefined && item.state === state) {
                count++;
            }
            else if (item !== undefined && state !== 'ready' && state !== 'failed' && item.state !== state) {
                count++;
            }

            return count;
        };

        $scope.$watch('nodes', function(data) {
            $scope.panelNodes.inProgress = {count: 0, nodes: []};
            $scope.panelNodes.ready = {count: 0, nodes: []};
            $scope.panelNodes.failed = {count: 0, nodes: []};

            updateData(data);
        });

        function updateData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state === 'ready' || data[i].state === 'failed') {
                    $scope.panelNodes[data[i].state].count++;
                    $scope.panelNodes[data[i].state].nodes[data[i].id] = data[i];
                }
                else {
                    $scope.panelNodes.inProgress.count++;
                    $scope.panelNodes.inProgress.nodes[data[i].id] = data[i];
                }
            }
        }
    });
