'use strict';

describe('Service: tableStateToRestApi', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var _TableStateToRestApi;
    beforeEach(inject(function (TableStateToRestApi) {
        _TableStateToRestApi = TableStateToRestApi;
    }));

    describe('#getOptions', function () {

        it('should parse tableState sort', function () {
            var tableStateMock = {
                pagination: {
                    number: 9,
                    numberOfPages: 0,
                    start: 0,
                    totalItemCount: 0
                },
                search:{},
                sort: {
                    predicate: '_source.timestamp',
                    reverse: false
                }
            };

            expect(_TableStateToRestApi.getOptions(tableStateMock)).toEqual(
                {
                    from: 0,
                    size: 9,
                    include_logs: true,
                    sort: {field: 'timestamp', order: 'asc'}
                }
            );
        });

        it('should parse tableState search - matchAny', function () {
            var tableStateMock = {
                pagination: {
                    number: 9,
                    numberOfPages: 0,
                    start: 0,
                    totalItemCount: 0
                },
                search: {
                    predicateObject: {
                        blueprint_id: {
                            matchAny: '["hello"]'
                        }
                    }
                },
                sort:{}
            };

            expect(_TableStateToRestApi.getOptions(tableStateMock)).toEqual(
                {
                    from: 0,
                    size: 9,
                    include_logs: true,
                    searches: [
                        {
                            predicate: 'blueprint_id',
                            matchAny: ['hello']
                        }
                    ]
                }
            );
        });

        it('should parse tableState search - gte', function () {
            var tableStateMock = {
                pagination: {
                    number: 9,
                    numberOfPages: 0,
                    start: 0,
                    totalItemCount: 0
                },
                search: {
                    predicateObject: {
                        timestamp: {
                            gte: '2015-09-17T05:05:00.000Z'
                        }
                    }
                },
                sort:{}
            };

            expect(_TableStateToRestApi.getOptions(tableStateMock)).toEqual(
                {
                    from: 0,
                    size: 9,
                    include_logs: true,
                    searches: [
                        {
                            predicate: 'timestamp',
                            gte: '2015-09-17T05:05:00.000Z',
                        }
                    ]
                }
            );
        });

        it('should parse tableState search - lte', function () {
            var tableStateMock = {
                pagination: {
                    number: 9,
                    numberOfPages: 0,
                    start: 0,
                    totalItemCount: 0
                },
                search: {
                    predicateObject: {
                        timestamp: {
                            lte: '2015-10-15T14:30:00.000Z'
                        }
                    }
                },
                sort:{}
            };

            expect(_TableStateToRestApi.getOptions(tableStateMock)).toEqual(
                {
                    from: 0,
                    size: 9,
                    include_logs: true,
                    searches: [
                        {
                            predicate: 'timestamp',
                            lte: '2015-10-15T14:30:00.000Z'
                        }
                    ]
                }
            );
        });

        it('should parse tableState search - gte with lte', function () {
            var tableStateMock = {
                pagination: {
                    number: 9,
                    numberOfPages: 0,
                    start: 0,
                    totalItemCount: 0
                },
                search: {
                    predicateObject: {
                        timestamp: {
                            lte: '2015-10-15T14:30:00.000Z',
                            gte: '2015-10-16T16:30:00.000Z'
                        }
                    }
                },
                sort:{}
            };

            expect(_TableStateToRestApi.getOptions(tableStateMock)).toEqual(
                {
                    from: 0,
                    size: 9,
                    include_logs: true,
                    searches: [
                        {
                            predicate: 'timestamp',
                            lte: '2015-10-15T14:30:00.000Z',
                            gte: '2015-10-16T16:30:00.000Z'
                        }
                    ]
                }
            );
        });
    });

});
