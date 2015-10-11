'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;
    var _cloudifyClient, _TableStateToRestApi, _EventsMap;

    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var init = inject(function ($rootScope, cloudifyClient, TableStateToRestApi, EventsMap) {
        _cloudifyClient = cloudifyClient;
        _TableStateToRestApi = TableStateToRestApi;
        _EventsMap = EventsMap;
        scope = $rootScope.$new();
        spyOnServices(); // default spies that you can later override
        initCtrl(); // default creation, you can later recreate..

    });

    var initCtrl = inject(function ($controller) {
        LogsCtrl = $controller('LogsCtrl', {
            $scope: scope
        });
    });

    var spyOnServices = function () {
        spyOn(_cloudifyClient.blueprints, 'list').andReturn({
            then: function () {
            }
        });

        spyOn(_cloudifyClient.deployments, 'list').andReturn({
            then: function () {
            }
        });

        spyOn(_cloudifyClient.events, 'get').andReturn({
            then: function () {
            }
        });

        spyOn(_TableStateToRestApi, 'getOptions').andReturn({});

        spyOn(_EventsMap, 'getEventIcon').andReturn('');

        spyOn(_EventsMap, 'getEventText').andReturn('');
    };

    beforeEach(init);

    describe('Controller tests', function () {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });
        describe('on first load', function () {
            it('should define filter options', function () {
                expect(scope.eventsFilter.blueprints).toEqual([]);
                expect(scope.eventsFilter.deployments).toEqual([]);
            });

            describe('mock getting filters info.', function () {
                beforeEach(function () {
                    _cloudifyClient.blueprints.list.andReturn({
                        then: function (successCallback) {
                            var response = {
                                data: [
                                    {
                                        'id': 'blueprint1'
                                    },
                                    {
                                        'id': 'blueprint2'
                                    }
                                ]
                            };
                            successCallback(response);
                        }
                    });

                    _cloudifyClient.deployments.list.andReturn({
                        then: function (successCallback) {
                            var response = {
                                data: [
                                    {
                                        'id': 'firstDep',
                                        'blueprint_id': 'blueprint1'

                                    },
                                    {
                                        'id': 'secondDep',
                                        'blueprint_id': 'blueprint1'
                                    },
                                    {
                                        'id': 'onlyOneDeployment',
                                        'blueprint_id': 'blueprint2'

                                    }
                                ]
                            };
                            successCallback(response);
                        }
                    });
                });

                it('should load blueprintsList', function () {
                    initCtrl();
                    expect(_cloudifyClient.blueprints.list).toHaveBeenCalled();
                    expect(scope.blueprintsList).toEqual([
                        {
                            'value': 'blueprint1',
                            'label': 'blueprint1'
                        },
                        {
                            'value': 'blueprint2',
                            'label': 'blueprint2'
                        }
                    ]);
                });

                it('should load deploymentsList', function () {
                    initCtrl();

                    expect(_cloudifyClient.deployments.list).toHaveBeenCalled();
                    expect(scope.deploymentsList).toEqual([
                        {
                            'value': 'firstDep',
                            'label': 'firstDep',
                            'parent': 'blueprint1'
                        },
                        {
                            'value': 'secondDep',
                            'label': 'secondDep',
                            'parent': 'blueprint1'
                        },
                        {
                            'value': 'onlyOneDeployment',
                            'label': 'onlyOneDeployment',
                            'parent': 'blueprint2'
                        }
                    ]);
                });
            });
        });

        describe('#updateData', function () {
            var defaultMockTableState;
            beforeEach(function () {
                //setting default tableState settings object
                defaultMockTableState = {
                    pagination: {}
                };
            });

            it('should update data on tableState change and not show error', function () {
                //mocking success response data from events
                _cloudifyClient.events.get.andReturn({
                    then: function (successCallback) {
                        var getLogsResponse = {
                            data: {
                                hits: {
                                    hits: [],
                                    total: 1
                                }
                            },
                            status: 200
                        };
                        successCallback(getLogsResponse);
                    }
                });

                expect(scope.logsHits).toBe(undefined);
                scope.updateData(defaultMockTableState);
                expect(scope.logsHits).not.toBe(undefined);
                expect(scope.getLogsError).toBe(null);
            });

            it('should show error when failing to update data on tableState Change', function () {
                //mocking failure response data from events
                _cloudifyClient.events.get.andReturn({
                    then: function (successCallback, failureCallback) {
                        var getLogsResponse = {
                            data: {
                                message: 'Getting logs failed message'
                            },
                            status: 500
                        };
                        failureCallback(getLogsResponse);
                    }
                });

                scope.updateData(defaultMockTableState);
                expect(scope.getLogsError).toBe('Getting logs failed message');
            });
        });

        describe('#clearFilters', function () {
            it('should clear filters',function(){
                initCtrl();
                scope.eventsFilter = {
                    'blueprints': ['blueprint1'],
                    'deployments': ['deployment2','deployment1'],
                    'logLevels': ['error','warning','info']
                };
                scope.clearFilters();
                expect(scope.eventsFilter).toEqual({
                    'blueprints': [],
                    'deployments': [],
                    'logLevels': []
                });
            });
        });
    });
});
