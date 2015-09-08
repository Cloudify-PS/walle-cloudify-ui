'use strict';

angular.module('cosmoUiApp')
    .controller('LogsCtrl', function ($scope, cloudifyClient, EventsMap ){
        // guy - temporarily removing all features. They will be readded by another jira issue.
        cloudifyClient.events.get({ order : 'desc'}).then(function( result ) {
            debugger;
            $scope.logsHits = result.data.hits.hits;
        });


        $scope.getEventIcon = function (event) {
            return EventsMap.getEventIcon(event);
        };

        $scope.getEventText = function (event) {
            return EventsMap.getEventText(event);
        };



    });
