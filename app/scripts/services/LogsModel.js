'use strict';

angular.module('cosmoUi')
    .service('LogsModel', function LogsModel() {
        var filterModelDefaults = {
            'blueprints': [null],
            'deployments': [null],
            'executions': [null],
            'timeframe': [(1000 * 60 * 5)]
        };
        var filterModel = angular.copy(filterModelDefaults);
        this.set = function(data) {
            for(var i in data) {
                if(filterModel.hasOwnProperty(i)) {
                    filterModel[i] = data[i];
                }
            }
        };
        this.reset = function() {
            filterModel = angular.copy(filterModelDefaults);
        };
        this.get = function() {
            return filterModel;
        };
    });
