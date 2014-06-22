'use strict';

angular.module('cosmoUi')
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

            for (var i = 0; i < $scope.allNodesArr.length; i++) {
                if ($scope.allNodesArr[i].dependents !== undefined && $scope.allNodesArr[i].dependents.length > 0) {
                    $scope.panelData.push({
                        id: $scope.allNodesArr[i].name,
                        statue: 'N/A',
                        totalCount: 0,
                        inProgress: {count: 0, nodes: []},
                        started: {count: 0, nodes: []},
                        failed: {count: 0, nodes: []}
                    });
                    updateNodeData($scope.allNodesArr[i], panelDataIdx);
                    panelDataIdx++;
                }
            }
        });

        function updateNodeData(data, idx) {
            var node = $scope.panelData[idx];
            node.totalCount = data.dependents.length;

            for (var j = 0; j < data.dependents.length; j++) {
                for (var i = 0; i < $scope.allNodesArr.length; i++) {
                    if ($scope.allNodesArr[i].id === data.dependents[j]) {
                        if ($scope.allNodesArr[i].state === 'started' || $scope.allNodesArr[i].state === 'failed') {
                            node.state = $scope.allNodesArr[i].state === 'failed' ? 'Failed' : 'Succeed';
                            node[$scope.allNodesArr[i].state].count++;
                            node[$scope.allNodesArr[i].state].nodes[$scope.allNodesArr[i].id] = $scope.allNodesArr[i];
                        }
                        else {
                            node.inProgress.count++;
                            node.inProgress.nodes[$scope.allNodesArr[i].id] = $scope.allNodesArr[i];
                        }
                    }
                }
            }
        }
    });
