'use strict';

describe('Service: EventsService', function () {

    var eventsService, events, _callback, q,
        isExecuted = false;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // load the service's module, mocking ejsResource dependency
            module('cosmoUiApp', 'ngMock', 'gsUiHelper', function($provide) {
                $provide.value('ejsResource', function() {
                    return {
                        QueryStringQuery: function() {
                            return {
                                query: function() {}
                            }
                        },
                        Request: function() {
                            return {
                                from: function() {
                                    return {
                                        size: function() {
                                            return {
                                                query: function() {
                                                    return {
                                                        sort: function() {
                                                            return {
                                                                doSearch: function() {
                                                                    var deferred = q.defer();

                                                                    deferred.resolve({});

                                                                    return deferred.promise;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        Sort: function() {
                            return {
                                order: function() {}
                            }
                        }
                    }
                });
            });

            // initialize a new instance of the filter
            inject(function (EventsService, $q) {
                q = $q;
                eventsService = EventsService;

                events = eventsService.newInstance('/');
                _callback = function() {
                    isExecuted = true;
                };
            });
        });
    });

    describe('Unit tests', function() {

        it('should create a new EventsService instance', function() {
            expect(!!eventsService).toBe(true);
        });

        it('should use defined autopull time provided by controller', function() {
            isExecuted = false;
            spyOn(events, 'autoPull').andCallThrough();

            events.execute(_callback, true, 1000);
            waitsFor(function() {
                return isExecuted;
            });

            runs(function() {
                expect(events.autoPull).toHaveBeenCalledWith(_callback, 1000);
            });
        });
    });
});
