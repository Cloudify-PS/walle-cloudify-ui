'use strict';

angular.module('cosmoUiApp')
    .controller('LogsCtrl', function ($scope, cloudifyClient, CloudifyService, EventsMap, $routeParams, TableStateToRestApi) {

        $scope.itemsPerPage = 9;
        $scope.eventsFilter = {
            'blueprints': [],
            'deployments': []
            //'timeRange':{
            //    'lte': "",
            //    'gte': ""
            //}
        };

        //TODO: make url params and params effect each other
        //loading filter options from the url params if given - enable us to present a specific event page by changing the url.
        //if ($routeParams.filter) {
        //    try {
        //        $scope.eventsFilter = JSON.parse($routeParams.filter);
        //    }
        //    catch (exception) {
        //        $scope.eventsFilter = null;
        //    }
        //}

        //Getting blueprint and deployments lists
        CloudifyService.blueprints.list()
            .then(function (data) {
                $scope.blueprintsList = [];
                $scope.deploymentsList = [];
                for (var j in data) {
                    var blueprint = data[j];
                    $scope.blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                    for (var i in blueprint.deployments) {
                        var deployemnt = blueprint.deployments[i];
                        $scope.deploymentsList.push({
                            'value': deployemnt.id,
                            'label': deployemnt.id,
                            'parent': blueprint.id
                        });
                    }
                }
            });

        /**
         * @description  generate and execute a query based on tableState to receive results and render them to the table
         * @param tableState - all the filters , sorts and pagination applied on the table
         */
        $scope.updateData = function (tableState) {
            var options = TableStateToRestApi.getOptions(tableState);

            cloudifyClient.events.get(options).then(function (response) {
                    $scope.getLogsError = null;
                    $scope.logsHits = response.data.hits.hits;
                    tableState.pagination.totalItemCount = response.data.hits.total;
                    tableState.pagination.numberOfPages = Math.ceil(response.data.hits.total / options.size);
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
    });
