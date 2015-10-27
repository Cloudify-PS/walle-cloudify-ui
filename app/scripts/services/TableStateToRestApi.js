'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.tableStateToRestApi
 * @description
 * # tableStateToRestApi
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
      .service('TableStateToRestApi', function () {

        this.getOptions = function(tableState){
            var options = {
                from: tableState.pagination.start,
                size: tableState.pagination.number,
                include_logs: true
            };

            //sorting
            if (Object.keys(tableState.sort).length > 0) {
                options.sort = {
                    field: tableState.sort.predicate,
                    order: tableState.sort.reverse ? 'desc' : 'asc'
                };
            }

            //searching
            if (Object.keys(tableState.search).length > 0) {
                options.searches = [];
                _.forEach(tableState.search.predicateObject, function (predicateObjectValue, predicateObjectKey) {
                    var currentSearchOptions = {};
                    if(predicateObjectKey !== '$'){
                        currentSearchOptions.predicate = predicateObjectKey;
                        if (predicateObjectValue.matchAny) {
                            try {
                                currentSearchOptions.matchAny = JSON.parse(predicateObjectValue.matchAny);
                                if(currentSearchOptions.matchAny.length > 0) {
                                    options.searches.push(currentSearchOptions);
                                }
                            }
                            catch(e){
                            }
                        }else {
                            if(predicateObjectValue.gte){
                                currentSearchOptions.gte = predicateObjectValue.gte;
                            }
                            if(predicateObjectValue.lte){
                                currentSearchOptions.lte = predicateObjectValue.lte;
                            }
                            if(Object.keys(currentSearchOptions).length>1){
                                options.searches.push(currentSearchOptions);
                            }
                        }
                    }
                });
            }
            return options;
        };

    });
