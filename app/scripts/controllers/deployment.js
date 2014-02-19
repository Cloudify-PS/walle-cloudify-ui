'use strict';

angular.module('cosmoUi')
    .controller('DeploymentCtrl', function ($scope, $rootScope, $cookieStore, $routeParams, RestService, BreadcrumbsService, YamlService, PlanDataConvert, blueprintCoordinateService, $http, ejsResource) {

        var totalNodes = 0,
            appStatus = {},
            deploymentModel = {},
            instances = 0;

        $scope.deployment = null;
        $scope.nodes = [];
        $scope.events = [];
        $scope.section = 'events';
        $scope.topologySettings = [
            {name: 'connections',   state: true},
            {name: 'modules',       state: false},
            {name: 'middleware',    state: true},
            {name: 'compute',       state: true}
        ];
        $scope.toggleBar = {
            'compute': true,
            'middleware': true,
            'modules': true,
            'connections': true
        };

        var eventCSSMap = {
            'workflow_received': {text: 'Workflow received', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_started': {text: 'Workflow started', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_initializing_policies': {text: 'Workflow initializing policies', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_initializing_node': {text: 'Workflow initializing node', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_success': {text: 'Workflow end successfully', icon: 'event-icon-workflow-end-successfully', class: 'event-text-green'},
            'workflow_failed': {text: 'Workflow failed', icon: 'event-icon-workflow-failed', class: 'event-text-red'},
            'workflow_stage': {text: 'Workflow Stage', icon: 'event-icon-task-sent', class: 'event-text-green'},
            'task_started': {text: 'Task started', icon: 'event-icon-task-started', class: 'event-text-green'},
            'sending_task': {text: 'Task sent', icon: 'event-icon-task-sent', class: 'event-text-green'},
            'task_received': {text: 'Task received', icon: 'event-icon-task-sent', class: 'event-text-green'},
            'task_succeeded': {text: 'Task end successfully', icon: 'event-icon-task-success', class: 'event-text-green'},
            'task_failed': {text: 'Task failed', icon: 'event-icon-task-failed', class: 'event-text-red'},
            'policy_success': {text: 'Policy end successfully started', icon: 'event-icon-policy-success', class: 'event-text-green'},
            'policy_failed': {text: 'Policy failed', icon: 'event-icon-policy-failed', class: 'event-text-red'}
        };
        var id = $routeParams.id;
        //var from = 0;
        //var to = 5;

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployment?id=' + id,
                label: id,
                id: 'deployment'
            });

        $scope.getEventClass = function(event) {
            return _getCssMapField( event, 'class');
        };

        $scope.getEventIcon = function(event) {
            //return _getCssMapField( event, 'icon');
            if(eventCSSMap.hasOwnProperty(event)) {
                return eventCSSMap[event].icon;
            }
        };

        $scope.getEventText = function(event) {
            return _getCssMapField( event, 'text') || event.type;
        };

        function _getCssMapField( event, field ){
            var eventMapping = getEventMapping(event);
            if ( !!eventMapping && eventCSSMap.hasOwnProperty(eventMapping) ){
                return eventCSSMap[eventMapping][field];
            } else {
                console.log([event, 'does not have field', field]);
                return '';
            }
        }

        function getEventMapping(event) {
            var eventMap;

            if (event.type === 'policy') {
                if (event.policy === 'start_detection_policy') {
                    eventMap = 'policy_success';
                } else if (event.policy === 'failed_detection_policy') {
                    eventMap = 'policy_failed';
                }
            } else if (event.type === 'workflow_stage') {
                if (event.stage.indexOf('Loading blueprint') !== -1) {
                    eventMap = 'workflow_started';
                } else if (event.stage.indexOf('executed successfully') !== -1) {
                    eventMap = 'workflow_success';
                } else if (event.stage.indexOf('Initializing monitoring policies') !== -1) {
                    eventMap = 'workflow_initializing_policies';
                } else if (event.stage.indexOf('Initializing node') !== -1) {
                    eventMap = 'workflow_initializing_node';
                }
            } else if (eventCSSMap[event.type] !== undefined) {
                eventMap = event.type;
            }

            return eventMap !== undefined ? eventMap : event.type;
        }

        /*function _loadEvents() {
            if (id === undefined) {
                return;
            }
            RestService.loadEvents({ deploymentId : id, from: from, to: to })
                .then(null, null, function(data) {
                    if (data.id !== undefined && data.lastEvent !== undefined) {

                        if (data.events && data.events.length > 0) {
                            $scope.events = $scope.events.concat(data.events);

                            for (var i = 0; i < $scope.events.length; i++) {
                                if (typeof($scope.events[0]) === 'string') {    // walkaround if the events returned as strings and not JSONs
                                    $scope.events[i] = JSON.parse($scope.events[i]);
                                }
                            }
                        }
                    }
                });
        }*/

        // Define Deployment Model in the first time
        function _setDeploymentModel( data ) {
            for (var i = 0; i < data.plan.nodes.length; i++) {
                var node = data.plan.nodes[i];
                if(!deploymentModel.hasOwnProperty(node.name)) {
                    deploymentModel[node.name] = {
                        'status': {},
                        'process': {},
                        'completed':  0,
                        'instances': node.instances.deploy
                    };
                }
                deploymentModel[node.name].status[node.id] = {
                    'reachable': null
                };
                instances += node.instances.deploy;
            }
        }

        function _drawPlan( dataPlan ) {
            var dataMap;

            // Convert edges to angular format
            if (dataPlan.hasOwnProperty('edges') && !!dataPlan.edges) {
                dataMap = PlanDataConvert.edgesToBlueprint(dataPlan.edges);
            }

            // Index data by ID
            if (dataPlan.hasOwnProperty('nodes') && !!dataPlan.nodes) {
                totalNodes = 0;
                $scope.indexNodes = {};
                dataPlan.nodes.forEach(function (node) {
                    $scope.indexNodes[node.id] = node;
                    totalNodes++;
                });
            }

            // Set Map
            blueprintCoordinateService.setMap(dataMap['cloudify.relationships.connected_to']);

            // Connection between nodes
            $scope.map = dataMap['cloudify.relationships.contained_in'];
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
            $scope.deployments = deploymentModel;
            $scope.appStatus = appStatus;
        }

        function _loadDeployment() {
            RestService.getDeploymentById({deploymentId : id})
                .then(function(deploymentData) {
                    // Set Deployment Model
                    _setDeploymentModel(deploymentData);

                    // Blueprint
                    RestService.getBlueprintById({id: deploymentData.blueprintId})
                        .then(function(data){
                            YamlService.loadJSON(id, data, function(err, data){
                                // Draw Blueprint Plan
                                _drawPlan(data.getJSON());
                            });
                        });

                    // Execution
                    RestService.getDeploymentNodes({deploymentId : id})
                        .then(null, null, function(dataNodes) {
                            $scope.nodes = dataNodes;
                        });
                });
        }

        // Update deployments process and values
        function updateDeployments() {
            for (var i in deploymentModel) {
                for (var instanceID in deploymentModel[i].status) {
                    var completed = 0, failed = 0, install = 0;
                    switch (deploymentModel[i].status[instanceID]) {
                    case true:
                        completed++;
                        break;
                    case false:
                        failed++;
                        break;
                    case null:
                        install++;
                        break;
                    }
                    deploymentModel[i].completed = completed;
                    deploymentModel[i].process = {
                        'done': processCalc(completed, deploymentModel[i].instances),
                        'failed': processCalc(failed, deploymentModel[i].instances)/*,
                        'install': processCalc(install, deploymentModel[i].instances)*/
                    };
                }
            }
        }

        // Calculate value by percents for pieProgress
        function processCalc(partOf, instances) {
            return Math.round(partOf > 0 ? 100 * partOf / instances : 0);
        }

        // Init
        _loadDeployment();
        //_loadEvents();

        // Execution Listener
        $scope.$watch('nodes', function(nodes){
            // Organizing the data by id
            var IndexedNodes = {}, completed = 0, failed = 0, install = 0;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                IndexedNodes[node.id] = node.reachable;
                switch (node.reachable) {
                case true:
                    completed++;
                    break;
                case false:
                    failed++;
                    break;
                /*case null:
                    install++;
                    break;*/
                }
            }
            // Update Deployment Model with new Data
            for (var d in deploymentModel) {
                var deployment = deploymentModel[d];
                for (var nodeId in deployment.status) {
                    if(IndexedNodes.hasOwnProperty(nodeId)) {
                        deployment.status[nodeId] = IndexedNodes[nodeId];
                    }
                }
            }
            // Total App Status
            appStatus = {
                'done': processCalc(completed, instances),
                'failed': processCalc(failed, instances),
                'install': processCalc(install, instances)
            };
        }, true);

        // Listener for deployments, update process values
        $scope.$watch('deployments', function(){
            updateDeployments();
        }, true);

        // TODO: return the right status by formula, need to ask Yaron or Guy
        $scope.getBadgeStatus = function() {
            return 'install';
        };

        // Get Icon by Type
        $scope.getIcon = function (type) {
            switch (type) {
            case 'server':
                return 'app-server';
            case 'host':
                return 'host';
            }
        };

        /**
         * Side panel
         */
        $scope.viewNode = function () {
            $scope.showProperties = {
                properties: {},
                policies: {},
                general: {}
            };
        };


        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };

        /* Filters DEMO - start */
        $scope.workflowsList = [
            {'value': null, 'label': 'All'},
            {'value': 'install', 'label': 'Install'},
            {'value': 'complete', 'label': 'Complete'},
            {'value': 'failed', 'label': 'Failed'}
        ];
        $scope.eventTypeList = [
            {'value': null, 'label': 'All'},
            {'value': 'workflow_stage', 'label': 'Workflow Stage'},
            {'value': 'workflow_started', 'label': 'Workflow Started'},
            {'value': 'workflow_succeeded', 'label': 'Workflow Succeeded'},
            {'value': 'task_succeeded', 'label': 'Task Succeeded'},
            {'value': 'sending_task', 'label': 'Sending Task'}
        ];
        /* Filters DEMO - end */

        function EsEvents(server) {

            if(!server) {
                return;
            }

            var ejs = ejsResource(server);
            var oQuery = ejs.QueryStringQuery();
            var client = ejs.Request()
                .from(0)
                .size(100);
            var activeFilters = {};

            function _isActiveFilter(field, term) {
                return activeFilters.hasOwnProperty(field + term);
            }

            function _applyFilters(query) {
                var filter = null;
                var filters = Object.keys(activeFilters).map(function (k) {
                    return activeFilters[k];
                });

                if (filters.length > 1) {
                    filter = ejs.AndFilter(filters);
                }
                else if (filters.length === 1) {
                    filter = filters[0];
                }

                return filter ? ejs.FilteredQuery(query, filter) : query;
            }

            function filter(field, term) {
                if(_isActiveFilter(field, term)) {
                    delete activeFilters[field + term];
                } else {
                    activeFilters[field + term] = ejs.TermFilter(field, term);
                }
            }

            function execute(callbackFn) {
                var results = client
                    .query(_applyFilters(oQuery.query('*')))
                    .doSearch();

                results.then(function(data){
                    if(data.hasOwnProperty('error')) {
                        console.error(data.error);
                    }
                    else if(angular.isFunction(callbackFn)) {
                        callbackFn(data);
                    }
                });
            }

            this.filter = filter;
            this.execute = execute;
        }

        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'type': null,
            'workflow': null,
            'nodes': null
        };

        var events = new EsEvents('http://cosmoes.gsdev.info'),
            lastNodeSearch = $scope.eventsFilter.nodes;

        $scope.eventsFilter = {
            'type': null,
            'workflow': null,
            'nodes': null
        };

        function executeEvents() {
            $scope.filterLoading = true;
            events.execute(function(data){
                $scope.eventHits = data.hits.hits;
                $scope.filterLoading = false;
            });
        }

        function filterEvents(field, newValue, oldValue, execute) {
            if(newValue === null) {
                return;
            }
            if(oldValue !== null && oldValue.value !== null) {
                events.filter(field, oldValue.value);
            }
            if(newValue.value !== null) {
                events.filter(field, newValue.value);
            }
            if(execute === true) {
                executeEvents();
            }
        }

        (function _LoadEvents() {
            filterEvents('type', {value: 'cloudify_event'}, null);
            filterEvents('context.execution_id', {value: id}, null);
            executeEvents();
        })();

        $scope.$watch('eventsFilter.type', function(newValue, oldValue){
            if(newValue !== null && oldValue !== null) {
                filterEvents('event_type', newValue, oldValue, true);
            }
        });

        $scope.$watch('eventsFilter.workflow', function(newValue, oldValue){
            if(newValue !== null && oldValue !== null) {
                filterEvents('context.workflow_id', newValue, oldValue, true);
            }
        });

        $scope.eventFindNodes = function() {
            if($scope.eventsFilter.nodes === '') {
                $scope.eventsFilter.nodes = null;
            }
            filterEvents('context.node_name', {value: $scope.eventsFilter.nodes}, {value: lastNodeSearch}, true);
            lastNodeSearch = $scope.eventsFilter.nodes;
        };

    });
