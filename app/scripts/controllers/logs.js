'use strict';

angular.module('cosmoUiApp')
    .controller('LogsCtrl', function ($scope, cloudifyClient, EventsMap, $routeParams, TableStateToRestApi, $location) {

        //default sorting desc timestamp - when there is not a specific query
        if(Object.keys($routeParams).length === 0){
            $location.search({sortByLogs: 'timestamp', reverseLogs: 'true'});
        }

        $scope.columns = [
            {name:'Event Type Icon',isSelected:true},
            {name:'Timestamp',isSelected:true},
            {name:'Event Type',isSelected:true},
            {name:'Log Level',isSelected:true},
            {name:'Operation',isSelected:true},
            {name:'Node Name',isSelected:true},
            {name:'Node Id',isSelected:true},
            {name:'Message',isSelected:true}
        ];

        $scope.itemsPerPage = 9;
        var initFilters = function() {
            $scope.eventsFilter = {
                'blueprints': [],
                'deployments': [],
                'logLevels': [],
                'timeRange':{
                    'gte': '',
                    'lte': ''
                },
                'messageText': '',
                'eventTypes': []
            };
        };
        initFilters();

        //Log levels List
        $scope.logLevelsList = [
            {value:'debug',label:'DEBUG'},
            {value:'info',label:'INFO'},
            {value:'warn',label:'WARN'},
            {value:'warning',label:'WARNING'},
            {value:'error',label:'ERROR'},
            {value:'fatal',label:'FATAL'},
            {value:'critical',label:'CRITICAL'}
        ];
        $scope.eventTypesList = [
            {value:'policy',label: EventsMap.getEventText('policy')},
            {value:'processing_trigger',label: EventsMap.getEventText('processing_trigger')},
            {value:'trigger_failed',label: EventsMap.getEventText('trigger_failed')},
            {value:'trigger_succeeded',label: EventsMap.getEventText('trigger_succeeded')},
            {value:'task_failed',label: EventsMap.getEventText('task_failed')},
            {value:'task_rescheduled',label: EventsMap.getEventText('task_rescheduled')},
            {value:'task_started',label: EventsMap.getEventText('task_started')},
            {value:'task_succeeded',label: EventsMap.getEventText('task_succeeded')},
            {value:'sending_task',label: EventsMap.getEventText('sending_task')},
            {value:'workflow_cancelled',label: EventsMap.getEventText('workflow_cancelled')},
            {value:'workflow_event',label: EventsMap.getEventText('workflow_event')},
            {value:'workflow_failed',label: EventsMap.getEventText('workflow_failed')},
            {value:'workflow_node_event',label: EventsMap.getEventText('workflow_node_event')},
            {value:'workflow_stage',label: EventsMap.getEventText('workflow_stage')},
            {value:'workflow_started',label: EventsMap.getEventText('workflow_started')},
            {value:'workflow_succeeded',label: EventsMap.getEventText('workflow_succeeded')}
        ];

        //Getting blueprints list
        cloudifyClient.blueprints.list()
            .then(function (response) {
                $scope.blueprintsList = [];
                _.forEach(response.data, function(blueprint){
                    $scope.blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                });
            });

        //getting deployments list
        cloudifyClient.deployments.list()
            .then(function(response){
                $scope.deploymentsList = [];
                _.forEach(response.data, function(deployment){
                    $scope.deploymentsList.push({
                        'value': deployment.id,
                        'label': deployment.id+' ['+deployment.blueprint_id+']',
                        'parent': deployment.blueprint_id
                    });
                });
            });

        $scope.clearFilters = function(){
            initFilters();
        };

        /**
         * @description  generate and execute a query based on tableState to receive results and render them to the table
         * @param tableState - all the filters , sorts and pagination applied on the table
         */
        $scope.updateData = function (tableState) {
            var options = TableStateToRestApi.getOptions(tableState);
            $scope.getLogsError = null;

            cloudifyClient.events.get(options).then(function (response) {
                $scope.logsHits = response.data.items;
                //Formatting the timestamp
                _.each($scope.logsHits, function(log){
                    log.formattedTimestamp = EventsMap.getFormattedTimestamp(log['@timestamp']);
                });
                var totalHits = response.data.metadata.pagination.total;
                tableState.pagination.totalItemCount = totalHits;
                tableState.pagination.numberOfPages = Math.ceil(totalHits / options._size);
            },function(response){
                $scope.getLogsError = response.data.message;
            });
        };

        //Mapping event_type text(returned from elasticsearch) to our desired css,text and icon
        $scope.getEventIcon = function (event) {
            return EventsMap.getEventIcon(event);
        };


        $scope.getEventText = function (event) {
            return EventsMap.getEventText(event);
        };

        //creating an Array of the values of the requested key
        $scope.pluckArrayOfObjects = function (objectsArray, key) {
            return _.pluck(objectsArray, key);
        };

        $scope.isAnyColumnSelected = function(){
            return _.some($scope.columns, 'isSelected', true);
        };

        //knowing when the user input is consider a valid date
        $scope.isValidTime = function(time){
            if(!time || time === '')
            {
                return false;
            }
            return time.constructor.name === 'Moment' || moment(time, 'YYYY-MM-DD HH:mm', true).isValid();
        };

    });
