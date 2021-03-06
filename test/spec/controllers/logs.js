'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;
    var _cloudifyClient, _TableStateToRestApi, _EventsMap, _$stateParams, _$location;

    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var init = inject(function ($rootScope, cloudifyClient, TableStateToRestApi, EventsMap, $location ) {
        _cloudifyClient = cloudifyClient;
        _TableStateToRestApi = TableStateToRestApi;
        _EventsMap = EventsMap;
        _$location = $location;
        _$stateParams = {}; //default route params object , can be override
        scope = $rootScope.$new();
        spyOnServices(); // default spies that you can later override
    });

    var initCtrl = inject(function ($controller) {
        LogsCtrl = $controller('LogsCtrl', {
            $scope: scope,
            $stateParams: _$stateParams
        });
    });

    var spyOnServices = function () {
        spyOn(_cloudifyClient.blueprints, 'list').and.returnValue({
            then: function () {
            }
        });

        spyOn(_cloudifyClient.deployments, 'list').and.returnValue({
            then: function () {
            }
        });

        spyOn(_cloudifyClient.events, 'get').and.returnValue({
            then: function () {
            }
        });

        spyOn(_TableStateToRestApi, 'getOptions').and.returnValue({});

        spyOn(_EventsMap, 'getEventIcon').and.returnValue('');

        spyOn(_EventsMap, 'getEventText').and.returnValue('');

        spyOn(_$location, 'search').and.callFake(function(){});
    };

    beforeEach(init);

    describe('Controller tests', function () {

        it('should create a controller', function () {
            initCtrl();
            expect(LogsCtrl).not.toBeUndefined();
        });
        describe('on first load', function () {
            it('should search url with timestamp desc when no parameter was given', function(){
                _$stateParams = {};
                initCtrl();

                expect(_$location.search).toHaveBeenCalledWith({ sortByLogs : 'timestamp', reverseLogs : 'true' });
            });

            it('should search url with timestamp desc when no parameter was given', function(){
                _$stateParams = {someKey:'someValue'};
                initCtrl();

                expect(_$location.search).not.toHaveBeenCalled();
            });


            it('should define filter options', function () {
                initCtrl();
                expect(scope.eventsFilter.blueprints).toEqual([]);
                expect(scope.eventsFilter.deployments).toEqual([]);
            });

            describe('mock getting filters info.', function () {
                beforeEach(function () {
                    _cloudifyClient.blueprints.list.and.returnValue({
                        then: function (successCallback) {
                            var response = {
                                data: {
                                    items: [
                                        {
                                            'id': 'blueprint1'
                                        },
                                        {
                                            'id': 'blueprint2'
                                        }
                                    ]
                                }
                            };
                            successCallback(response);
                        }
                    });

                    _cloudifyClient.deployments.list.and.returnValue({
                        then: function (successCallback) {
                            var response = {
                                data: {
                                    items: [
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
                                }
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
                            'label': 'firstDep [blueprint1]',
                            'parent': 'blueprint1'
                        },
                        {
                            'value': 'secondDep',
                            'label': 'secondDep [blueprint1]',
                            'parent': 'blueprint1'
                        },
                        {
                            'value': 'onlyOneDeployment',
                            'label': 'onlyOneDeployment [blueprint2]',
                            'parent': 'blueprint2'
                        }
                    ]);
                });
            });
        });

        describe('#updateData success', function () {
            var defaultMockTableState = {
                pagination: {}
            };

            beforeEach(function (done) {
                initCtrl();

                _cloudifyClient.events.get.and.returnValue({
                    then: function (successCallback) {
                        var getLogsResponse = {
                            data: {
                                items: [],
                                metadata: {
                                    pagination:{
                                        total: 1
                                    }
                                }
                            },
                            status: 200
                        };
                        successCallback(getLogsResponse);
                    }
                });
                scope.updateData(defaultMockTableState);

                setTimeout(function () {
                    done();
                }, 350);
            });

            it('should update data on tableState change and not show error', function () {
                expect(scope.logsHits).not.toBe(undefined);
                expect(scope.getLogsError).toBe(null);
            });
        });

        describe('#updateData error', function () {
            var defaultMockTableState = {
                pagination: {}
            };

            beforeEach(function (done) {
                initCtrl();

                _cloudifyClient.events.get.and.returnValue({
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

                setTimeout(function () {
                    done();
                }, 350);
            });

            it('should show error when failing to update data on tableState Change', function () {
                expect(scope.getLogsError).toBe('Getting logs failed message');
            });
        });

        describe('#clearFilters', function () {
            it('should clear filters',function(){
                initCtrl();
                scope.eventsFilter = {
                    'blueprints': ['blueprint1'],
                    'deployments': ['deployment2','deployment1'],
                    'logLevels': ['error','warning','info'],
                    'eventTypes': ['task_sent'],
                    'timeRange': {
                        'gte': new moment('2015-06-17T15:50:00.000Z'),
                        'lte': new moment('2015-06-18T16:50:00.000Z')
                    },
                    'messageText': 'free text'
                };
                scope.clearFilters();
                expect(scope.eventsFilter).toEqual({
                    'blueprints': [],
                    'deployments': [],
                    'logLevels': [],
                    'eventTypes': [],
                    'timeRange': {
                        'gte': '',
                        'lte': ''
                    },
                    'messageText': ''
                });
            });
        });
        describe('#isValidTime' , function(){
            it('should check if value is an expected time', function(){
                initCtrl();
                expect(scope.isValidTime(undefined)).toBe(false);
                expect(scope.isValidTime('')).toBe(false);
                expect(scope.isValidTime('any string')).toBe(false);
                expect(scope.isValidTime('123456789')).toBe(false);
                //a number of characters expected as date
                expect(scope.isValidTime('1234567890123456')).toBe(false);
                expect(scope.isValidTime('2015/10/12 10:10')).toBe(false);
                expect(scope.isValidTime('2015-10-12 10:10')).toBe(true);
                expect(scope.isValidTime(new moment())).toBe(true);
            });
        });
    });
});
