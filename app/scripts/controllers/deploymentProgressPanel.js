'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentProgressPanelCtrl', function ($scope, $routeParams, EventsService) {
        var deployment_id = $routeParams.id;
        var panelData = {};
        $scope.panelData = panelData;
        $scope.panelOpen = true;

        var events = EventsService.newInstance('/backend/events'),
            eventHits = {};

        events.filter('event_type', 'task_started');
        events.filter('context.deployment_id', deployment_id);


        function getEventsStarted() {
            events.execute(function(data){
                console.log(['data', data]);
                if(data.hasOwnProperty('hits')) {
                    eventHits = data.hits.hits;
                }
            }, true);
        }

        function stopEventsStarted() {
            events.stopAutoPull();
        }

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

        $scope.getClass = function(node) {
            var _class = 'inProgress';
            if (node.failed.count > 0) {
                _class = 'failed';
            } else if (node.started.count > 0 && node.inProgress.count === 0 && node.failed.count === 0) {
                _class = 'success';
            }
            return _class;
        };

        $scope.$watch('panelOpen', function(isOpen){
            if(isOpen) {
                getEventsStarted();
            }
            else {
                stopEventsStarted();
            }
        });

        $scope.$watch('nodes', function(data) {
            for(var n in data) {
                var node = data[n];
                if(!panelData.hasOwnProperty(node.node_id)) {
                    panelData[node.node_id] = {
                        id: node.node_id,
                        status: node.state,
                        totalCount: 0,
                        count: 0,
                        inProgress: {count: 0, nodes: []},
                        started: {count: 0, nodes: []},
                        failed: {count: 0, nodes: []},
                        start_time: getElapsedTime(node)
                    };
                    updateNodeProgress(node);
                }
            }
        });

        function updateNodeProgress(instanceNode) {
            var states = ['started', 'failed'],
                node = panelData[instanceNode.node_id],
                totalCount = 0;

            for(var i in instanceNode.node_instances) {
                var instance = instanceNode.node_instances[i];
                if(instance.deployment_id === instanceNode.deployment_id) {
                    if (states.indexOf(instance.state) !== -1) {
                        node[instance.state].count++;
                        node[instance.state].nodes[instanceNode.node_id] = node;
                    }
                    else {
                        node.inProgress.count++;
                        node.inProgress.nodes[instanceNode.node_id] = node;
                    }
                    totalCount++;
                }
            }
            node.totalCount = totalCount;
        }

        function getOldestEventByNodeId(id) {
            var oldest = null;
            for(var i in eventHits) {
                var event = eventHits[i];
                if(event._source.context.hasOwnProperty('node_id') && event._source.context.node_id === id) {
                    if(oldest === null) {
                        oldest = event;
                    }
                    else if(event._source.timestemp < oldest._source.timestemp) {
                        oldest = event;
                    }
                }
            }
            return oldest;
        }

        function getElapsedTime(node) {
            if(!node.hasOwnProperty('start_time')) {
                var event = getOldestEventByNodeId(node.id);
                if(event !== null) {
                    return event._source.timestamp;
                }
            }
            return false;
        }
    });
