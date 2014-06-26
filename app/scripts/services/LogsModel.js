'use strict';

angular.module('cosmoUiApp')
    .service('LogsModel', function LogsModel() {
        var filterModelDefaults = {
            'blueprints': [null],
            'deployments': [null],
            'executions': [null],
            'timeframe': [(1000 * 60 * 5)],
            'startdate': new Date().getTime()
        };
        var fromTimeText = 'now';
        var filterModel = angular.copy(filterModelDefaults);
        this.set = function(data) {
            for(var i in data) {
                if(filterModel.hasOwnProperty(i)) {
                    filterModel[i] = data[i];
                }
            }
            if(data.hasOwnProperty('startdate')) {
                fromTimeText = 'event time';
            }
        };
        this.reset = function() {
            filterModel = angular.copy(filterModelDefaults);
        };
        this.get = function() {
            return filterModel;
        };
        this.getFromTimeText = function() {
            return fromTimeText;
        };
    });
