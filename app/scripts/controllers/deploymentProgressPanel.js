'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentProgressPanelCtrl', function ($scope, $routeParams, EventsService) {
        var deployment_id = $routeParams.id;
        $scope.panelData = {};
        $scope.panelOpen = true;

        var events = EventsService.newInstance('/backend/events'),
            eventHits = {};

        events.filter('event_type', 'task_started');
        events.filter('context.deployment_id', deployment_id);


        function getEventsStarted() {
            events.execute(function(data){
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
                $scope.panelData[node.node_id] = {
                    id: node.node_id,
                    status: node.state,
                    totalCount: 0,
                    count: 0,
                    inProgress: {count: 0, nodes: []},
                    started: {count: 0, nodes: []},
                    failed: {count: 0, nodes: []},
                    start_time: convertToTimeObject(getElapsedTime(node))
                };
                updateNodeProgress(node);
            }
        });

        function updateNodeProgress(instanceNode) {
            var states = ['started', 'failed'],
                node = $scope.panelData[instanceNode.node_id],
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
                if(event._source.context.hasOwnProperty('node_name') && event._source.context.node_name === id && event._source.context.execution_id === $scope.currentExecution.id) {
                    if(oldest === null) {
                        oldest = event;
                    }
                    else if(convertTimeToTimestemp(event._source['@timestamp']) < convertTimeToTimestemp(oldest._source['@timestamp'])) {
                        oldest = event;
                    }
                }
            }
            return oldest;
        }

        function getElapsedTime(node) {
            if(!node.hasOwnProperty('start_time')) {
                var event = getOldestEventByNodeId(node.node_id);
                if(event !== null) {
                    return event._source['@timestamp'];
                }
            }
            return false;
        }

        function convertTimeToTimestemp(date) {
            return Math.round(new Date(date).getTime()/1000);
        }

        function convertToTimeObject(date) {
            var timestamp = new Date().getTime() - new Date(date).getTime();
            if (date === false) {
                return null;
            } else {
                return {
                    seconds: Math.floor((timestamp / 1000) % 60),
                    minutes: Math.floor(((timestamp / (60000)) % 60)),
                    hours : Math.floor(((timestamp / (3600000)) % 24)),
                    days: Math.floor(((timestamp / (3600000)) / 24))
                };
            }
        }
    });
