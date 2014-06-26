'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentProgressPanelCtrl', function ($scope) {
        $scope.panelOpen = false;
        $scope.panelData = [];

        $scope.getWorkflow = function() {
            if ($scope.selectedWorkflow.data === null) {
                return 'All workflows';
            } else {
                return $scope.selectedWorkflow.data.label;
            }
        };

        $scope.togglePanel = function() {
            $scope.panelOpen = $scope.panelOpen === false;
        };

        $scope.getNodesCount = function(node, state) {
            var count = 0;
            for (var i = 0; i < $scope.panelData.length; i++) {
                if (node === null) {
                    count += $scope.panelData[i][state].count;
                }
                else if ($scope.panelData[i].id === node.id) {
                    count = $scope.panelData[i][state].count;
                }
            }
            return count;
        };

        $scope.getClass = function(node) {
            var _class = 'inProgress';
            if (node.failed.count > 0) {
                _class = 'failed';
            } else if (node.started.count > 0 && node.inProgress.count === 0 && node.failed.count === 0) {
                _class = 'success';
            }
            return _class;
        };

        $scope.$watch('nodes', function() {
            $scope.panelData = [];
            var panelDataIdx = 0;

            for (var i = 0; i < $scope.nodes.length; i++) {
                if ($scope.nodes[i].node_instances !== undefined && $scope.nodes[i].node_instances.length > 0) {
                    $scope.panelData.push({
                        id: $scope.nodes[i].node_id,
                        status: $scope.nodes[i].state,
                        totalCount: 0,
                        inProgress: {count: 0, nodes: []},
                        started: {count: 0, nodes: []},
                        failed: {count: 0, nodes: []}
                    });
                    updateNodeData($scope.nodes[i], panelDataIdx);
                    panelDataIdx++;
                }
            }
        });

        function updateNodeData(data, idx) {
            var node = $scope.panelData[idx];
            node.totalCount = data.node_instances.length;

            for (var j = 0; j < data.node_instances.length; j++) {
                for (var i = 0; i < $scope.nodes.length; i++) {
                    if ($scope.nodes[i].id === data.node_instances[j].id) {
                        if ($scope.nodes[i].state === 'started' || $scope.nodes[i].state === 'failed') {
                            node[$scope.nodes[i].state].count++;
                            node[$scope.nodes[i].state].nodes[$scope.nodes[i].id] = $scope.nodes[i];
                        }
                        else {
                            node.inProgress.count++;
                            node.inProgress.nodes[$scope.nodes[i].id] = $scope.nodes[i];
                        }
                    }
                }
            }
        }
    });
