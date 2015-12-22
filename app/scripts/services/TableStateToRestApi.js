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

        this.getOptions = function (tableState) {
            var options = {
                //paginating
                _offset: tableState.pagination.start,
                _size: tableState.pagination.number
            };

            //sorting
            if (Object.keys(tableState.sort).length > 0) {
                var sortOrder = tableState.sort.reverse ? '-' : '+';
                var sortField = tableState.sort.predicate;

                //HACK: changing timestamp to @timestamp
                if (sortField === 'timestamp') {
                    sortField = '@timestamp';
                }

                options._sort = sortOrder + sortField;
            }

            //searching
            if (Object.keys(tableState.search).length > 0) {
                _.forEach(tableState.search.predicateObject, function (predicateObjectValue, predicateObjectKey) {
                    if (predicateObjectKey !== '$') {

                        //HACK: changing timestamp to @timestamp
                        if (predicateObjectKey === 'timestamp') {
                            predicateObjectKey = '@timestamp';
                        }
                        //HACK: changing message to message.text
                        if (predicateObjectKey === 'message') {
                            predicateObjectKey = 'message.text';
                        }

                        if (predicateObjectValue.matchAny) {
                            try {
                                var matchList = JSON.parse(predicateObjectValue.matchAny);
                                if (matchList.length > 0) {
                                    options[predicateObjectKey] = matchList;
                                }
                            }
                            catch (e) {

                            }
                        } else if (predicateObjectValue.gte || predicateObjectValue.lte) {
                            try {
                                //smartTable wrap everything with double quotes assuming everything can be an object, so we need to remove them
                                var gte = predicateObjectValue.gte ? predicateObjectValue.gte : '';
                                var lte = predicateObjectValue.lte ? predicateObjectValue.lte : '';
                                options._range = predicateObjectKey + ',' + gte + ',' + lte;
                            }
                            catch (e) {
                            }
                        } else if (predicateObjectValue.equalTo) {
                            var equalTo = predicateObjectValue.equalTo;
                            if (equalTo.length > 0) {
                                options[predicateObjectKey] = equalTo;
                            }
                        }
                    }
                });
            }
            return options;
        };

    });
