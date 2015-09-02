'use strict';

angular.module('cosmoUiApp')
    .controller('LogsCtrl', function ($scope, EventsService, CloudifyService, EventsMap) {

        $scope.itemsPerPage = 9;

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

        $scope.updateData =function (tableState){
            var options = {
                from: tableState.pagination.start,
                size: tableState.pagination.number
                ///*           query: {},
                //           filters: [],
                //*/
                };

            if( Object.keys(tableState.sort ).length > 0){
                options.sort ={
                    field: tableState.sort.predicate,
                    order: tableState.sort.reverse ? 'desc' : 'asc',
                    //field: "timestamp",
                    //order: 'asc'
                };
            }
            console.log(tableState);
            console.log(options);
            EventsService.execute(options, function(error, response){

                //console.log(response.data);
                    $scope.logsHits = response.data.hits.hits;
                    tableState.pagination.totalItemCount = response.data.hits.total;
                    tableState.pagination.numberOfPages = Math.ceil(response.data.hits.total/options.size);
            });
        };

        //Mapping event_type text(returned from elasticsearch) to our desired css,text and icon
        $scope.getEventIcon = function (event) {
            return EventsMap.getEventIcon(event);
        };


        $scope.getEventText = function (event) {
            return EventsMap.getEventText(event);
        };
    });
