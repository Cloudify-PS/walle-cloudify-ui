'use strict';

angular.module('cosmoUiApp')
    .service('EventsService', function EventsService($http, $q, ejsResource, $log, $rootScope, $filter,cloudifyClient ) {

        this.execute = function(options, callBack) {
            return cloudifyClient.events.get(options, callBack);
        };
    });
